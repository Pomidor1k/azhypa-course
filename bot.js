const {
    Telegraf
} = require('telegraf');
require('dotenv').config();
const keyboards = require('./keyboards')
const dataBase = require('./dataBase')
const LocalSession = require('telegraf-session-local');
const messages = require('./messages.json')

const bot = new Telegraf("5944241967:AAHU4-QYIzxLczDTiagj5RqcvIufP28KY7I");
const localSession = new LocalSession({
    database: 'session_db.json'
});
bot.use(localSession.middleware());

/*Functions*/
function getCurrentDateTime() {
    const now = new Date();

    const DD = String(now.getDate()).padStart(2, '0');
    const MM = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы в JS начинаются с 0
    const YY = now.getFullYear();

    const HH = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${DD}:${MM}:${YY} ${HH}:${minutes}`;
}
/*Functions*/
bot.command('delete', async (ctx) => {
    const userId = ctx.from.id
    try {
        await dataBase.deleteMe(`${userId}`)
    } catch (error) {
        
    }
})


const getInvoice = (id, rate, userLanguage) => {
    const title = userLanguage === 'en' ? `${rate} subscription` : `Подписка ${rate}`
    const amount = rate === 'pro' ? 100 * 89 : (rate === 'advanced' ? 100 * 68 : 100 * 39);
    const description = rate === 'pro' ? 
    `В подписку уровня PRO входит 3 эксклюзивных видеоурока\n2 теста по пройденному материалу\nФормула\nСессия 1 на 1 со мной, где мы разберем твои проекты` : 
    rate === 'advanced' ? 
    `В подписку уровня ADVANCED входит 3 эксклюзивных видеоурока\n2 теста по пройденному материалу\nФормула\nВы сможете повысить уровень подписки после прохождения курса` : 
    rate === 'basic' ? 
    `В подписку уровня BASIC входит 3 эксклюзивных видеоурока\n2 теста по пройденному материалу\nФормула\nВы сможете повысить уровень подписки после прохождения курса` : 
    'Неизвестный уровень подписки';


    const invoice = {
      chat_id: id, // Уникальный идентификатор целевого чата или имя пользователя целевого канала
      provider_token: '410694247:TEST:aebd8bbd-6444-46bf-ac9c-f27737ac76fc', // токен выданный через бот @SberbankPaymentBot 
      start_parameter: 'get_access', //Уникальный параметр глубинных ссылок. Если оставить поле пустым, переадресованные копии отправленного сообщения будут иметь кнопку «Оплатить», позволяющую нескольким пользователям производить оплату непосредственно из пересылаемого сообщения, используя один и тот же счет. Если не пусто, перенаправленные копии отправленного сообщения будут иметь кнопку URL с глубокой ссылкой на бота (вместо кнопки оплаты) со значением, используемым в качестве начального параметра.
      title: title, // Название продукта, 1-32 символа
      description: description, // Описание продукта, 1-255 знаков
      currency: 'USD', // Трехбуквенный код валюты ISO 4217
      prices: [{ label: title, amount: amount }], // Разбивка цен, сериализованный список компонентов в формате JSON 100 копеек * 100 = 100 рублей
      payload: 'firstPayment'
    }
  
    return invoice
  }


bot.start(async (ctx) => {
    const parameter = ctx.message.text.split(' ')[1];
    const userId = ctx.from.id;
    const userName = ctx.from.username ? ctx.from.username : "none"
    ctx.session.canSendMessage = false;
    const userRates = {
        'level_pro': 'pro',
        'level_advanced': 'advanced',
        'level_basic': 'basic'
    };

    const userRate = userRates[parameter] || 'none';
    const serverDomain = 'https://azhypa-web-apps.onrender.com'
    try {
        ctx.session.video1Link = `${serverDomain}/video1/${userId}`
        ctx.session.video2Link = `${serverDomain}/video2/${userId}`
        ctx.session.video3Link = `${serverDomain}/video3/${userId}`
        ctx.session.video4BtoALink = `${serverDomain}/video4BA/${userId}`
        ctx.session.video4BtoPLink = `${serverDomain}/video4BP/${userId}`
        await ctx.replyWithHTML("Выберите язык\n------------------------\nChoose language", keyboards.chooseLanguageKeyboard);
    } catch (error) {
        console.error(error);
        await ctx.replyWithHTML("Выберите язык\n------------------------\nChoose language", keyboards.chooseLanguageKeyboard);
    }
    try {
        await dataBase.addUser(`${userId}`, userName, userRate);
        await dataBase.addLinksEmpty(`${userId}`, "firstVideoLink", "", "secondVideoLink", "", "thirdVideoLink", "", "firstTestCount", 1, "secondTestCount", 1)
        if (userRate !== 'pro' && userRate !== 'advanced') {
            await dataBase.addBasicUpgradeLinks(`${userId}`, "videoFourBtoALink", "", "videoFourBtoPLink", "")
        }
        ctx.session.rate = userRate
        ctx.session.userName = userName
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await dataBase.addUser(`${userId}`, userName, userRate);
        }, 86500000);
    }
});




bot.on('text', (ctx, next) => {
    if (!ctx.session.canSendMessage) {
        return;
    } else {
        return next();
    }
});


bot.on('photo', (ctx, next) => {
    // Игнорируем фото
});

// Middleware для игнорирования видео
bot.on('video', (ctx, next) => {
    // Игнорируем видео
});

bot.on('voice', (ctx, next) => {
    // Игнорируем голосовые сообщения
});

// Middleware для игнорирования документов
bot.on('document', (ctx, next) => {
    // Игнорируем документы
});


bot.action("russian_language_button", async (ctx) => {
    const userId = ctx.from.id
    try {
        await dataBase.addParameter(`${userId}`, "userLanguage", "ru")
        ctx.session.userLanguage = "ru"
        await ctx.deleteMessage()
        const userRate = await dataBase.getRate(`${userId}`)
        if (userRate !== 'none') {
            await ctx.replyWithInvoice(getInvoice(ctx.from.id, ctx.session.rate, ctx.session.userLanguage))
        } else {
            await ctx.replyWithHTML(messages.chooseRateMsg.ru, keyboards.chooseRateKeyboard)
        }
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await dataBase.addParameter(`${userId}`, "userLanguage", "ru")
            ctx.session.userLanguage = "ru"
        }, 86500000)
        const userRate = await dataBase.getRate(`${userId}`)
        if (userRate !== 'none') {
            await ctx.replyWithInvoice(getInvoice(ctx.from.id, ctx.session.rate, ctx.session.userLanguage))
        } else {
            await ctx.replyWithHTML(messages.chooseRateMsg.ru, keyboards.chooseRateKeyboard)
        }

    }
})

bot.action("english_language_button", async (ctx) => {
    const userId = ctx.from.id
    try {
        await dataBase.addParameter(`${userId}`, "userLanguage", "en")
        ctx.session.userLanguage = "en"
        await ctx.deleteMessage()
        const userRate = await dataBase.getRate(`${userId}`)
        if (userRate !== 'none') {
            await ctx.replyWithInvoice(getInvoice(ctx.from.id, ctx.session.rate, ctx.session.userLanguage))
        } else {
            await ctx.replyWithHTML(messages.chooseRateMsg.en, keyboards.chooseRateKeyboard)
        }
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await dataBase.addParameter(`${userId}`, "userLanguage", "en")
            ctx.session.userLanguage = "en"
        }, 86500000)
        const userRate = await dataBase.getRate(`${userId}`)
        if (userRate !== 'none') {
            await ctx.replyWithInvoice(getInvoice(ctx.from.id, ctx.session.rate, ctx.session.userLanguage))
        } else {
            await ctx.replyWithHTML(messages.chooseRateMsg.en, keyboards.chooseRateKeyboard)
        }
    }
})
/*Language Handlers*/

bot.action("payment_pro_rate_button", async (ctx) => {
    ctx.session.rate = 'pro'
    const userId = ctx.from.id
    try {
        await ctx.replyWithInvoice(getInvoice(ctx.from.id, ctx.session.rate, ctx.session.userLanguage))
        await dataBase.addParameter(`${userId}`, "rate", "pro")
    } catch (error) {
        setTimeout(async () => {
            await ctx.replyWithInvoice(getInvoice(ctx.from.id, ctx.session.rate, ctx.session.userLanguage))
        }, 5000);
        setTimeout(async () => {
            await dataBase.addParameter(`${userId}`, "rate", "pro")
        }, 86500000);
    }
})
bot.action("payment_advanced_rate_button", async (ctx) => {
    const userId = ctx.from.id
    ctx.session.rate = 'advanced'
    try {
        await ctx.replyWithInvoice(getInvoice(ctx.from.id, ctx.session.rate, ctx.session.userLanguage))
        await dataBase.addParameter(`${userId}`, "rate", "advanced")
    } catch (error) {
        setTimeout(async () => {
            await ctx.replyWithInvoice(getInvoice(ctx.from.id, ctx.session.rate, ctx.session.userLanguage))
        }, 5000);
        setTimeout(async () => {
            await dataBase.addParameter(`${userId}`, "rate", "advanced")
        }, 86500000);
    }
})





bot.action("payment_basic_rate_button", async (ctx) => {
    const userId = ctx.from.id
    ctx.session.rate = 'basic'
    try {
        await ctx.replyWithInvoice(getInvoice(ctx.from.id, ctx.session.rate, ctx.session.userLanguage))
        await dataBase.addParameter(`${userId}`, "rate", "basic")
    } catch (error) {
        setTimeout(async () => {
            await ctx.replyWithInvoice(getInvoice(ctx.from.id, ctx.session.rate, ctx.session.userLanguage))
        }, 5000);
        setTimeout(async () => {
            await dataBase.addParameter(`${userId}`, "rate", "basic")
        }, 86500000);
    }
})

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))

bot.on('successful_payment', async (ctx, next) => { // ответ в случае положительной оплаты
    const paymentInfo = ctx.update.message.successful_payment;

    switch (paymentInfo.invoice_payload) { // используем payload для определения типа оплаты
        case 'firstPayment':
            await ctx.replyWithPhoto({
                source: './payment_success_img.jpg'
            }, keyboards.paymentSuccessKeyboard[ctx.session.userLanguage])
            break;
        case 'upgradeAdvToPro':
            ctx.session.upgradedToPro = true
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.upgradeToProSuccess.ru : messages.upgradeToProSuccess.en, keyboards.startSignUpForSessionKeyboard[ctx.session.userLanguage])
            await dataBase.addParameter(`${ctx.from.id}`, "upgradedToPro", true)
            // Ваша логика по обработке расширения подписки
            break;
        case 'upgradeBasToAdv':
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.basicToAdvancedVideoFourMsg.ru : messages.basicToAdvancedVideoFourMsg.en, keyboards.basicToAdvancedVideoFourKeyboard[ctx.session.userLanguage])
                // Ваша логика по обработке расширения подписки
            break;
        case 'upgradeBasToPro':
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.basicToProVideoFourMsg.ru : messages.basicToProVideoFourMsg.en, keyboards.basicToProVideoFourKeyboard[ctx.session.userLanguage])
            await dataBase.addParameter(`${ctx.from.id}`, "basicToProUpgrade", true)
                // Ваша логика по обработке расширения подписки
            break;

        default:
            ctx.reply('Спасибо за покупку!');
            break;
    }
})



bot.action("payment_success_button", async (ctx) => {
    const userId = ctx.from.id
    try {
        const paymentDate = getCurrentDateTime()
        await dataBase.addPaymentInfo(`${userId}`, "paymentStatus", true, "paymentDate", paymentDate)
        await dataBase.addFirstTestPassedCurrent(`${userId}`, "firstTestPassed", false)
        await dataBase.addSecondTestPassedCurrent(`${userId}`, "secondTestPassed", false)
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.fisrtVideoIntroMsg.ru : messages.fisrtVideoIntroMsg.en, keyboards.goToFirstVideoKeyboard[ctx.session.userLanguage])
    } catch (error) {
        console.error(error);
        const paymentDate = getCurrentDateTime()
        setTimeout(async () => {
            await dataBase.addPaymentInfo(userId, "paymentStatus", true, "paymentDate", paymentDate)
        }, 86500000)
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.fisrtVideoIntroMsg.ru : messages.fisrtVideoIntroMsg.en)
        }, 5000);
    }
})

bot.action("watch_lessons_one_button", async (ctx) => {
    const userId = ctx.from.id
    try {
        await ctx.replyWithHTML(ctx.session.video1Link ? ctx.session.video1Link : `https://azhypa-web-apps.onrender.com/video1/${userId}`, keyboards.watchedFirstVideoKeyboard[ctx.session.userLanguage])
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.firstVideoLinkMsg.ru : messages.firstVideoLinkMsg.en, keyboards.watchedFirstVideoKeyboard[ctx.session.userLanguage])
        }, 5000);
    }
})

bot.action("first_video_finished_button", async (ctx) => {
    const userId = ctx.from.id
    try {
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.firstVideoOutroMsg.ru : messages.firstVideoOutroMsg.en, keyboards.startFirstTestKeyboard[ctx.session.userLanguage])
        await dataBase.watchFirstTestPassed(`${userId}`, async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.secondVideoIntroMsg.ru : messages.secondVideoIntroMsg.en, keyboards.introSecondLessonKeyboard[ctx.session.userLanguage])
        })
        await dataBase.watchUserFirstTestCount(`${userId}`, async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.firstTestSkipOfferMsg.ru : messages.firstTestSkipOfferMsg.en, keyboards.firstTestSkipKeyboard[ctx.session.userLanguage])
        })
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.firstVideoOutroMsg.ru : messages.firstVideoOutroMsg.en, keyboards.startFirstTestKeyboard[ctx.session.userLanguage])
            await dataBase.watchFirstTestPassed(`${userId}`, async () => {
                await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.secondVideoIntroMsg.ru : messages.secondVideoIntroMsg.en, keyboards.introSecondLessonKeyboard[ctx.session.userLanguage])
            })
            await dataBase.watchUserFirstTestCount(`${userId}`, async () => {
                await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.firstTestSkipOfferMsg.ru : messages.firstTestSkipOfferMsg.en, keyboards.firstTestSkipKeyboard[ctx.session.userLanguage])
            })
        }, 5000);
    }
})



bot.action("watch_lesson_two_button", async (ctx) => {
    const userId = ctx.from.id
    try {
        await ctx.replyWithHTML(ctx.session.video2Link ? ctx.session.video2Link : `https://azhypa-web-apps.onrender.com/video2/${userId}`, keyboards.watchedSecondVideoKeyboard[ctx.session.userLanguage])
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.secondVideoLinkMsg.ru : messages.secondVideoLinkMsg.en, keyboards.watchedSecondVideoKeyboard[ctx.session.userLanguage])
        }, 5000);
    }
})

bot.action("second_video_finished_button", async (ctx) => {
    const userId = ctx.from.id
    try {
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.secondVideoOutroMsg.ru : messages.secondVideoOutroMsg.en, keyboards.startSecondTestKeyboard[ctx.session.userLanguage])
        await dataBase.watchSecondTestPassed(`${userId}`, async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.thirdVideoIntroMsg.ru : messages.thirdVideoIntroMsg.en, keyboards.introThirdLessonKeyboard[ctx.session.userLanguage])
        })
        await dataBase.watchUserSecondTestCount(`${userId}`, async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.firstTestSkipOfferMsg.ru : messages.firstTestSkipOfferMsg.en, keyboards.secondTestSkipKeyboard[ctx.session.userLanguage])
        })
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.secondVideoOutroMsg.ru : messages.secondVideoOutroMsg.en, keyboards.startSecondTestKeyboard[ctx.session.userLanguage])
        }, 5000);
    }
})


bot.action("first_test_skip_button", async (ctx) => {
    try {
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.secondVideoIntroMsg.ru : messages.secondVideoIntroMsg.en, keyboards.introSecondLessonKeyboard[ctx.session.userLanguage])
    } catch (error) {
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.secondVideoIntroMsg.ru : messages.secondVideoIntroMsg.en, keyboards.introSecondLessonKeyboard[ctx.session.userLanguage]) 
        }, 5000);
    }
})

bot.action("second_test_skip_button", async (ctx) => {
    try {
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.thirdVideoIntroMsg.ru : messages.thirdVideoIntroMsg.en, keyboards.introThirdLessonKeyboard[ctx.session.userLanguage])
    } catch (error) {
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.thirdVideoIntroMsg.ru : messages.thirdVideoIntroMsg.en, keyboards.introThirdLessonKeyboard[ctx.session.userLanguage])
        }, 5000);
    }
})


bot.action("watch_lesson_three_button", async (ctx) => {
    const userId = ctx.from.id
    try {
        await ctx.replyWithHTML(ctx.session.video3Link ? ctx.session.video3Link : `https://azhypa-web-apps.onrender.com/video3/${userId}`, keyboards.getMaterialsKeyboard[ctx.session.userLanguage])
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.thirdVideoLinkMsg.ru : messages.thirdVideoLinkMsg.en, keyboards.getMaterialsKeyboard[ctx.session.userLanguage])
        }, 5000);
    }
})

bot.action("get_materials_button", async (ctx) => {
    try {
        await ctx.replyWithPhoto({
            source: 'formula1.png'
        })
        await ctx.replyWithPhoto({
            source: 'formula2.png'
        }, keyboards.getAccessToChatKeyboard[ctx.session.userLanguage])
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await ctx.replyWithPhoto({
                source: 'formula1.png'
            })
            await ctx.replyWithPhoto({
                source: 'formula2.png'
            }, keyboards.getAccessToChatKeyboard[ctx.session.userLanguage])
        }, 5000);
    }
})

bot.action("get_access_to_chat_button", async (ctx) => {
    const userId = ctx.from.id
    try {
        await ctx.replyWithHTML("https://t.me/+vRPrDecgJ5k1MmFi")
        try {
            const userRate = await dataBase.getRate(`${userId}`)
            if (userRate === 'pro') {
                await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.signUpForSessionMsg.ru : messages.signUpForSessionMsg.en, keyboards.startSignUpForSessionKeyboard[ctx.session.userLanguage])
                ctx.session.fullName = ""
                ctx.session.instName = ""
                ctx.session.whoAreYou = ""
                ctx.session.userAim = ""
                ctx.session.realizeAim = ""
                ctx.session.userWeaknesses = ""
                ctx.session.userClient = ""
            } else if (userRate === 'advanced') {
                await ctx.replyWithVideo({source: "./special_videos/SPECIAL_ADVANCED.mp4"})
                await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.advancedToProUpgradeOfferMsg.ru : messages.advancedToProUpgradeOfferMsg.en, keyboards.advancedToProUpgradeOfferKeyboard[ctx.session.userLanguage])
            } else if (userRate === 'basic') {
                await ctx.replyWithVideo({source: "./special_videos/SPECIAL_BASIC.mp4"})
                await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.basicUpgradeOfferMsg.ru : messages.basicUpgradeOfferMsg.en, keyboards.basicUpgradeOfferKeyboard[ctx.session.userLanguage])
            }
        } catch (error) {
            console.error(error);
            const userRate = ctx.session.rate
            if (userRate === 'pro') {
                await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.signUpForSessionMsg.ru : messages.signUpForSessionMsg.en, keyboards.startSignUpForSessionKeyboard[ctx.session.userLanguage])
                ctx.session.fullName = ""
                ctx.session.instName = ""
                ctx.session.whoAreYou = ""
                ctx.session.userAim = ""
                ctx.session.realizeAim = ""
                ctx.session.userWeaknesses = ""
                ctx.session.userClient = ""
            } else if (userRate === 'advanced') {
                await ctx.replyWithVideo({
                    source: "./special_videos/SPECIAL_ADVANCED.mp4"
                })
                await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.advancedToProUpgradeOfferMsg.ru : messages.advancedToProUpgradeOfferMsg.en, keyboards.advancedToProUpgradeOfferKeyboard[ctx.session.userLanguage])
            }
        }
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await ctx.replyWithHTML("https://t.me/+vRPrDecgJ5k1MmFi")
            try {
                const userRate = await dataBase.getRate(`${userId}`)
                if (userRate === 'pro') {
                    await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.signUpForSessionMsg.ru : messages.signUpForSessionMsg.en, keyboards.startSignUpForSessionKeyboard[ctx.session.userLanguage])
                    ctx.session.fullName = ""
                    ctx.session.instName = ""
                    ctx.session.whoAreYou = ""
                    ctx.session.userAim = ""
                    ctx.session.realizeAim = ""
                    ctx.session.userWeaknesses = ""
                    ctx.session.userClient = ""
                } else if (userRate === 'advanced') {
                    await ctx.replyWithVideo({source: "./special_videos/SPECIAL_ADVANCED.mp4"})
                    await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.advancedToProUpgradeOfferMsg.ru : messages.advancedToProUpgradeOfferMsg.en, keyboards.advancedToProUpgradeOfferKeyboard[ctx.session.userLanguage])
                } else if (userRate === 'basic') {
                    await ctx.replyWithVideo({source: "./special_videos/SPECIAL_BASIC.mp4"})
                    await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.basicUpgradeOfferMsg.ru : messages.basicUpgradeOfferMsg.en, keyboards.basicUpgradeOfferKeyboard[ctx.session.userLanguage])
                }
            } catch (error) {
                console.error(error);
                const userRate = ctx.session.rate
                if (userRate === 'pro') {
                    await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.signUpForSessionMsg.ru : messages.signUpForSessionMsg.en, keyboards.startSignUpForSessionKeyboard[ctx.session.userLanguage])
                    ctx.session.fullName = ""
                    ctx.session.instName = ""
                    ctx.session.whoAreYou = ""
                    ctx.session.userAim = ""
                    ctx.session.realizeAim = ""
                    ctx.session.userWeaknesses = ""
                    ctx.session.userClient = ""
                } else if (userRate === 'advanced') {
                    await ctx.replyWithVideo({
                        source: "./special_videos/SPECIAL_ADVANCED.mp4"
                    })
                    await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.advancedToProUpgradeOfferMsg.ru : messages.advancedToProUpgradeOfferMsg.en, keyboards.advancedToProUpgradeOfferKeyboard[ctx.session.userLanguage])
                }
            }
        }, 5000);
    }
})


bot.action("upgrade_to_pro_button", async (ctx) => {
    const userId = ctx.from.id
    ctx.session.fullName = ""
    ctx.session.instName = ""
    ctx.session.whoAreYou = ""
    ctx.session.userAim = ""
    ctx.session.realizeAim = ""
    ctx.session.userWeaknesses = ""
    ctx.session.userClient = ""

    const getAtoPInvoice = (id, userLanguage) => {
        const title = userLanguage === 'en' ? `ADVANCED to PRO upgrade` : `Апгрейд с ADVANCED до PRO`
        const amount = 2100;
        const invoice = {
          chat_id: id, // Уникальный идентификатор целевого чата или имя пользователя целевого канала
          provider_token: '410694247:TEST:aebd8bbd-6444-46bf-ac9c-f27737ac76fc', // токен выданный через бот @SberbankPaymentBot 
          start_parameter: 'get_access', //Уникальный параметр глубинных ссылок. Если оставить поле пустым, переадресованные копии отправленного сообщения будут иметь кнопку «Оплатить», позволяющую нескольким пользователям производить оплату непосредственно из пересылаемого сообщения, используя один и тот же счет. Если не пусто, перенаправленные копии отправленного сообщения будут иметь кнопку URL с глубокой ссылкой на бота (вместо кнопки оплаты) со значением, используемым в качестве начального параметра.
          title: title, // Название продукта, 1-32 символа
          description: 'При апгрейде ты получишь доступ к сессии 1 на 1 со мной, где мы рассмотрим твои проекты и сделаем работу над ошибками.', // Описание продукта, 1-255 знаков
          currency: 'USD', // Трехбуквенный код валюты ISO 4217
          prices: [{ label: title, amount: amount }], // Разбивка цен, сериализованный список компонентов в формате JSON 100 копеек * 100 = 100 рублей
          payload: 'upgradeAdvToPro'
        }
      
        return invoice
      }

    try {
        await ctx.replyWithInvoice(getAtoPInvoice(ctx.from.id, ctx.session.userLanguage))
    } catch (error) {
        console.error(error);
        ctx.session.upgradedToPro = true
        setTimeout(async () => {
            // await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.upgradeToProSuccess.ru : messages.upgradeToProSuccess.en, keyboards.startSignUpForSessionKeyboard[ctx.session.userLanguage])
            await ctx.replyWithInvoice(getAtoPInvoice(ctx.from.id, ctx.session.userLanguage))
        }, 5000);
        setTimeout(async () => {
            // await dataBase.addParameter(`${userId}`, "upgradedToPro", true)
        }, 86500000);
    }
})

const getBtoPInvoice = (id, userLanguage) => {
    const title = userLanguage === 'en' ? `BASIC to PRO upgrade` : `Апгрейд с BASIC до PRO`
    const amount = 5000;
    const invoice = {
      chat_id: id, // Уникальный идентификатор целевого чата или имя пользователя целевого канала
      provider_token: '410694247:TEST:aebd8bbd-6444-46bf-ac9c-f27737ac76fc', // токен выданный через бот @SberbankPaymentBot 
      start_parameter: 'get_access', //Уникальный параметр глубинных ссылок. Если оставить поле пустым, переадресованные копии отправленного сообщения будут иметь кнопку «Оплатить», позволяющую нескольким пользователям производить оплату непосредственно из пересылаемого сообщения, используя один и тот же счет. Если не пусто, перенаправленные копии отправленного сообщения будут иметь кнопку URL с глубокой ссылкой на бота (вместо кнопки оплаты) со значением, используемым в качестве начального параметра.
      title: title, // Название продукта, 1-32 символа
      description: 'При апгрейде ты получишь доступ к ещё одному эксклюзивному уроку\nМы проведем сессию 1 на 1 и сможет вместе разобрать твои проекты', // Описание продукта, 1-255 знаков
      currency: 'USD', // Трехбуквенный код валюты ISO 4217
      prices: [{ label: title, amount: amount }], // Разбивка цен, сериализованный список компонентов в формате JSON 100 копеек * 100 = 100 рублей
      payload: 'upgradeBasToPro'
    }
  
    return invoice
  }

  const getBtoAInvoice = (id, userLanguage) => {
    const title = userLanguage === 'en' ? `BASIC to ADVANCED upgrade` : `Апгрейд с BASIC до ADVANCED`
    const amount = 2900;
    const invoice = {
      chat_id: id, // Уникальный идентификатор целевого чата или имя пользователя целевого канала
      provider_token: '410694247:TEST:aebd8bbd-6444-46bf-ac9c-f27737ac76fc', // токен выданный через бот @SberbankPaymentBot 
      start_parameter: 'get_access', //Уникальный параметр глубинных ссылок. Если оставить поле пустым, переадресованные копии отправленного сообщения будут иметь кнопку «Оплатить», позволяющую нескольким пользователям производить оплату непосредственно из пересылаемого сообщения, используя один и тот же счет. Если не пусто, перенаправленные копии отправленного сообщения будут иметь кнопку URL с глубокой ссылкой на бота (вместо кнопки оплаты) со значением, используемым в качестве начального параметра.
      title: title, // Название продукта, 1-32 символа
      description: 'При апгрейде ты получишь доступ к ещё одному эксклюзивному уроку', // Описание продукта, 1-255 знаков
      currency: 'USD', // Трехбуквенный код валюты ISO 4217
      prices: [{ label: title, amount: amount }], // Разбивка цен, сериализованный список компонентов в формате JSON 100 копеек * 100 = 100 рублей
      payload: 'upgradeBasToAdv'
    }
  
    return invoice
  }

bot.action("basic_to_pro_upgrade_button", async (ctx) => {
    const userId = ctx.from.id
    ctx.session.basicToProUpgrade = true
    try {
        await ctx.replyWithInvoice(getBtoPInvoice(ctx.from.id, ctx.session.userLanguage))
        await dataBase.addParameter(`${userId}`, "basicToProUpgrade", true)
    } catch (error) {
        setTimeout(async () => {
            await ctx.replyWithInvoice(getBtoPInvoice(ctx.from.id, ctx.session.userLanguage))
        }, 5000);
        setTimeout(async () => {
            await dataBase.addParameter(`${userId}`, "basicToProUpgrade", true)
        }, 86500000);
    }
})

bot.action("basic_to_pro_video_four_button", async (ctx) => {
    const userId = ctx.from.id
    try {
        await ctx.replyWithHTML(ctx.session.video4BtoPLink ? ctx.session.video4BtoPLink : `https://azhypa-web-apps.onrender.com/video4BP/${userId}`, keyboards.basicToProGetFormulaKeyboard[ctx.session.userLanguage])
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.fourthVideoLinkMsg.ru : messages.fourthVideoLinkMsg.en, keyboards.basicToProGetFormulaKeyboard[ctx.session.userLanguage])
        }, 5000);
    }
})

bot.action("basic_to_pro_get_formula_button", async (ctx) => {
    try {
        await ctx.replyWithPhoto({
            source: 'formula2.png'
        }, keyboards.basicToProGiveInfoKeyboard[ctx.session.userLanguage])
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await ctx.replyWithPhoto({
                source: 'formula2.png'
            }, keyboards.basicToProGiveInfoKeyboard[ctx.session.userLanguage])
        }, 5000);
    }
})

bot.action("basic_to_pro_sign_up_session_button", async (ctx) => {
    try {
        ctx.session.fullName = ""
        ctx.session.instName = ""
        ctx.session.whoAreYou = ""
        ctx.session.userAim = ""
        ctx.session.realizeAim = ""
        ctx.session.userWeaknesses = ""
        ctx.session.userClient = ""
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.signUpForSessionMsg.ru : messages.signUpForSessionMsg.en, keyboards.startSignUpForSessionKeyboard[ctx.session.userLanguage])
    } catch (error) {
        ctx.session.fullName = ""
        ctx.session.instName = ""
        ctx.session.whoAreYou = ""
        ctx.session.userAim = ""
        ctx.session.realizeAim = ""
        ctx.session.userWeaknesses = ""
        ctx.session.userClient = ""
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.signUpForSessionMsg.ru : messages.signUpForSessionMsg.en, keyboards.startSignUpForSessionKeyboard[ctx.session.userLanguage])
        }, 5000);
    }
})


bot.action("basic_to_advanced_upgrade_button", async (ctx) => {
    try {
        await ctx.replyWithInvoice(getBtoAInvoice(ctx.from.id, ctx.session.userLanguage))
    } catch (error) {
        setTimeout(async () => {
            await ctx.replyWithInvoice(getBtoAInvoice(ctx.from.id, ctx.session.userLanguage))
        }, 5000);
    }
})

bot.action("basic_to_advanced_video_four_button", async (ctx) => {
    const userId = ctx.from.id
    try {
        await ctx.replyWithHTML(ctx.session.video4BtoALink ? ctx.session.video4BtoALink : `https://azhypa-web-apps.onrender.com/video4BA/${userId}`, keyboards.basicToAdvancedGetFormulaKeyboard[ctx.session.userLanguage])
    } catch (error) {
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.basicToAdvancedVideoFourLinkMsg.ru : messages.basicToAdvancedVideoFourLinkMsg.en, keyboards.basicToAdvancedGetFormulaKeyboard[ctx.session.userLanguage])
        }, 5000);
    }
})

bot.action("basic_to_advanced_get_formula_button", async (ctx) => {
    try {
        await ctx.replyWithPhoto({
            source: 'formula2.png'
        }, keyboards.basicToAdvancedFinalMsg[ctx.session.userLanguage])
    } catch (error) {
        setTimeout(async () => {
            await ctx.replyWithPhoto({
                source: 'formula2.png'
            }, keyboards.basicToAdvancedFinalMsg[ctx.session.userLanguage])
        }, 5000);
    }
})

bot.action("basic_to_advanced_final_msg", async (ctx) => {
    try {
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.basicToAdvancedFinalMsg.ru : messages.basicToAdvancedFinalMsg.en)
        ctx.session.canSendMessage = false
    } catch (error) {
        console.error(error);
    }
})

bot.action("start_sign_up_button", async (ctx) => {
    const userId = ctx.from.id
    ctx.session.canSendMessage = true;
    try {
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.userFullName.ru : messages.userFullName.en)
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.userFullName.ru : messages.userFullName.en)
        }, 5000);
    }
})

bot.on("message", async (ctx) => {
    const userId = ctx.from.id
    const userAnswer = ctx.message.text
    if (ctx.session.fullName === "") {
        ctx.session.fullName = userAnswer
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.userInstName.ru : messages.userInstName.en)
    } else if (ctx.session.instName === "" && ctx.session.fullName !== "") {
        ctx.session.instName = userAnswer
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.whoAreYou.ru : messages.whoAreYou.en)
    } else if (ctx.session.whoAreYou === "" && ctx.session.instName !== "") {
        ctx.session.whoAreYou = userAnswer
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.userAim.ru : messages.userAim.en)
    } else if (ctx.session.userAim === "" && ctx.session.whoAreYou !== "") {
        ctx.session.userAim = userAnswer
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.userAimRealize.ru : messages.userAimRealize.en)
    } else if (ctx.session.realizeAim === "" && ctx.session.userAim !== "") {
        ctx.session.realizeAim = userAnswer
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.userWeaknesses.ru : messages.userWeaknesses.en)
    } else if (ctx.session.userWeaknesses === "" && ctx.session.realizeAim !== "") {
        ctx.session.userWeaknesses = userAnswer
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.userClient.ru : messages.userClient.en)
    } else if (ctx.session.userClient === "" && ctx.session.userWeaknesses !== "") {
        ctx.session.userClient = userAnswer
        const checkAnswersRu = `Проверьте свои ответы:\n\n<b>Твои Имя и Фамилия:</b> ${ctx.session.fullName}\n<b>Твой никнейм Instagram:</b> ${ctx.session.instName}\n<b>Кто ты:</b> ${ctx.session.whoAreYou}\n<b>Твоя цель:</b> ${ctx.session.userAim}\n<b>Как можно достигнуть цели:</b> ${ctx.session.realizeAim}\n<b>Твои слабости:</b> ${ctx.session.userWeaknesses}\n<b>Кто твой клиент:</b> ${ctx.session.userClient}`
        const checkAnswersEn = `Check your answers:\n\n<b>Name and Surname:</b> ${ctx.session.fullName}\n<b>Instagram nickname:</b> ${ctx.session.instName}\n<b>Who are you:</b> ${ctx.session.whoAreYou}\n<b>Your goal:</b> ${ctx.session.userAim}\n<b>How to realize goal:</b> ${ctx.session.realizeAim}\n<b>Your weaknesses:</b> ${ctx.session.userWeaknesses}\n<b>Your client:</b> ${ctx.session.userClient}`
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? checkAnswersRu : checkAnswersEn, keyboards.checkAnswersKeyboard[ctx.session.userLanguage])
    }
})


bot.action("answers_are_right_button", async (ctx) => {
    const userId = ctx.from.id
    ctx.session.canSendMessage = false;
    try {
        await ctx.deleteMessage()
        await dataBase.addUserPersonalInfo(`${userId}`, "userFullName", ctx.session.fullName, "userInstName", ctx.session.instName, "userWhoAreYou", ctx.session.whoAreYou, "userAim", ctx.session.userAim, "userAimRealize", ctx.session.realizeAim, "userWeaknesses", ctx.session.userWeaknesses, "userClient", ctx.session.userClient)
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.proFinalMsg.ru : messages.proFinalMsg.en)
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.proFinalMsg.ru : messages.proFinalMsg.en)
        }, 5000);
        setTimeout(async () => {
            await dataBase.addUserPersonalInfo(`${userId}`, "userFullName", ctx.session.fullName, "userInstName", ctx.session.instName, "userWhoAreYou", ctx.session.whoAreYou, "userAim", ctx.session.userAim, "userAimRealize", ctx.session.realizeAim, "userWeaknesses", ctx.session.userWeaknesses, "userClient", ctx.session.userClient)
        }, 86500000);
    }
})

bot.action("give_data_again_button", async (ctx) => {
    ctx.session.fullName = ""
    ctx.session.instName = ""
    ctx.session.whoAreYou = ""
    ctx.session.userAim = ""
    ctx.session.realizeAim = ""
    ctx.session.userWeaknesses = ""
    ctx.session.userClient = ""
    try {
        await ctx.deleteMessage()
        await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.userFullName.ru : messages.userFullName.en)
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await ctx.replyWithHTML(ctx.session.userLanguage === "ru" ? messages.userFullName.ru : messages.userFullName.en)
        }, 5000);
    }
})

/*BOT starting*/
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));