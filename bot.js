const { Telegraf } = require('telegraf')
const express = require('express');
const path = require('path');
const LocalSession = require('telegraf-session-local')
const messages = require('./messages')
const keyboards = require('./keyboards')
const mainDb = require('./dataBases/firebase')
const functions = require('./functions');

const bot = new Telegraf('6664007271:AAGIYnU3pxOwTXgzuNylrqZRWRWw6dl39Ao')
const localSession = new LocalSession({database: 'session_db.json'})
bot.use(localSession.middleware())
const app = express();
const port = 3000;
app.use(express.static(__dirname));
app.use(express.json());


const paymentLinks = {
    "basic": "https://mel.store/azhypa/27002",
    "advanced": "https://mel.store/azhypa/27001",
    "pro": "https://mel.store/azhypa/26997",
    "advanced-pro": "https://mel.store/azhypa/27004",
    "basic-advanced": "https://mel.store/azhypa/27008",
    "basic-pro": "https://mel.store/azhypa/27010"
}

async function paymentSuccessHandler(ctx) {
    console.log("works");
    app.post('/payment-recieved', async (req, res) => {
        const { userId, paymentStep, userEmail, userPhone, userName, paymentPrice, productId } = req.body


        try {
            if (paymentStep === 'primary') {
                try {
                    await mainDb.updateUserAfterPaymentInfo(userId,
                        userEmail,
                        userPhone,
                        userName,
                        paymentPrice,
                        productId
                        )
                } catch (error) {
                    console.error(error);
                }

                try {
                    await mainDb.deleteDocument(userEmail)
                } catch (error) {
                    console.error(error);
                    setTimeout(async () => {
                        await mainDb.deleteDocument(userEmail)
                    }, 90000000);
                }

                ctx.replyWithPhoto({source: './assets/images/successPayment.jpg'}, {
                    protect_content: true,
                    ...keyboards.successPaymentKeyboard 
                })
            } else if (paymentStep === 'advanced-pro') {
                if (String(productId) === '27004') {
                    ctx.session.timeOut6 = false
                    try {
                        await ctx.replyWithHTML(messages.advancedUpgradeSuccessPaymentMessage.ru, keyboards.signUpForSessionIntroKeyboard)
                    } catch (error) {
                        console.error(error);
                        await ctx.replyWithHTML(messages.techProblemsMessage.ru)
                    }

                    try {
                        await mainDb.updateUserParameter(userId, "userUpgradedAdvToPro", true)
                    } catch (error) {
                        console.error(error);
                        setTimeout(async () => {
                            await mainDb.updateUserParameter(userId, "userUpgradedAdvToPro", true) 
                        }, 90000000);
                    }

                    try {
                        await mainDb.deleteDocument(userEmail)
                    } catch (error) {
                        console.error(error);
                        setTimeout(async () => {
                            await mainDb.deleteDocument(userEmail)
                        }, 90000000);
                    }
                } else {
                    await ctx.replyWithHTML(messages.techProblemsMessage.ru)
                }
            } else if (paymentStep === 'basic-advanced') {
                if (String(productId) === '27008') {
                    try {
                        await ctx.replyWithHTML(messages.basicUpgradeToAdvancedLessonFourIntroMessage.ru, keyboards.fourthLessonBasicIntroKeyboard)

                        setTimeout(async () => {
                            await ctx.replyWithDocument({source: './assets/images/formula2.png'}, {
                                protect_content: true,
                                disable_notification: true
                            })
                        }, 5000);

                        setTimeout(async () => {
                            await ctx.replyWithHTML(messages.basicUpgradeToAdvancedFinalMessage.ru, {
                                disable_notification: true
                            })
                        }, 10000);
                    } catch (error) {
                        console.error(error);
                        await ctx.replyWithHTML(messages.techProblemsMessage.ru)
                    }

                    try {
                        await mainDb.updateUserParameter(userId, "userUpgradedBasToAdvanced", true)
                    } catch (error) {
                        console.error(error);
                        setTimeout(async () => {
                            await mainDb.updateUserParameter(userId, "userUpgradedBasToAdvanced", true) 
                        }, 90000000);
                    }

                    try {
                        await mainDb.deleteDocument(userEmail)
                    } catch (error) {
                        console.error(error);
                        setTimeout(async () => {
                            await mainDb.deleteDocument(userEmail)
                        }, 90000000);
                    }
                }
            } else if (paymentStep === 'basic-pro') {
                if (String(productId) === '27010') {
                    try {
                        await ctx.replyWithHTML(messages.basicUpgradeToProLessonFourIntroMessage.ru, keyboards.fourthLessonBasicIntroKeyboard)
                    } catch (error) {
                        console.error(error);
                        await ctx.replyWithHTML(messages.techProblemsMessage.ru)
                    }

                    setTimeout(async () => {
                        await ctx.replyWithDocument({source: './assets/images/formula2.png'}, {
                            protect_content: true,
                            disable_notification: true
                        })
                    }, 5000);

                    setTimeout(async () => {
                        await ctx.replyWithHTML(messages.signUpForSessionIntroMessage.ru, {
                            disable_notification: true,
                            ...keyboards.signUpForSessionIntroKeyboard
                        })
                    }, 10000);

                    try {
                        await mainDb.updateUserParameter(userId, "userUpgradedBasToPro", true)
                    } catch (error) {
                        console.error(error);
                        setTimeout(async () => {
                            await mainDb.updateUserParameter(userId, "userUpgradedBasToPro", true) 
                        }, 90000000);
                    }

                    try {
                        await mainDb.deleteDocument(userEmail)
                    } catch (error) {
                        console.error(error);
                        setTimeout(async () => {
                            await mainDb.deleteDocument(userEmail)
                        }, 90000000);
                    }
                }
            }
        } catch (error) {
            console.error(error);
            ctx.replyWithHTML(messages.techProblemsMessage.ru)
        }
    })
}
async function rateChosenHandler(ctx) {
    app.post('/rate-is-chosen', async (req, res) => {
        ctx.session.timeOut4 = false
        const { userId, rateLevel } = req.body
        if (userId && rateLevel) {
            ctx.session.userRate = rateLevel
            try {
                await mainDb.updateUserParameter(userId, "userRate", rateLevel)
            } catch (error) {
                console.error(error);
                
                setTimeout(async () => {
                    await mainDb.updateUserParameter(userId, "userRate", rateLevel)
                }, 90000000);
            }
            try {
                await ctx.replyWithHTML(messages.paymentLinkMessage.ru + paymentLinks[ctx.session.userRate], keyboards.paymentLinkKeyboard)
                paymentSuccessHandler(ctx)
                setTimeout(async () => {
                    if (ctx.session.timeOut5) {
                        await ctx.replyWithHTML(messages.paymentIssuesMessage.ru, keyboards.paymentIssuesKeyboard)
                        paymentSuccessHandler(ctx)
                    }
                }, 30000);
            } catch (error) {
                console.error(error);
                await ctx.reply(messages.techProblemsMessage.ru)
            }
        }
    })
}
async function firstTestHandler(ctx) {
    app.post('/first-test-finished', async (req, res) => {
        const { userId, testAttempts, testSkipped, testPassed } = req.body
        try {
            await mainDb.updateUserTests(userId, "userFirstTestPassed", testPassed, "userFirstTestSkipped", testSkipped, "userFirstTestAttempts", testAttempts)
        } catch (error) {
            console.error(error);

            setTimeout(async () => {
                await mainDb.updateUserTests(userId, "userFirstTestPassed", testPassed, "userFirstTestSkipped", testSkipped, "userFirstTestAttempts", testAttempts)
            }, 90000000);
        }
        try {
            await ctx.replyWithPhoto({source: './assets/images/lesson2.jpg'}, {
                protect_content: true,
                caption: messages.secondLessonVideoIntroMessage.ru,
                ...keyboards.secondLessonVideoIntroKeyboard
            })

            setTimeout(async () => {
                await ctx.replyWithPhoto({source: './assets/images/test2.jpg'}, {
                    disable_notification: true,
                    protect_content: true,
                    caption: messages.secondLessonTestStartMessage.ru,
                    ...keyboards.secondLessonTestStartKeyboard
                })
                secondTestHandler(ctx)
            }, 10000);
        } catch (error) {
            console.error(error);
            
        }
        try {
            
        } catch (error) {
            console.error(error);
            await ctx.reply(messages.techProblemsMessage.ru)
        }
    })
}
async function secondTestHandler(ctx) {
    app.post('/second-test-finished', async (req, res) => {
        const { userId, testAttempts, testSkipped, testPassed } = req.body
        try {
            await mainDb.updateUserTests(userId, "userSecondTestPassed", testPassed, "userSecondTestSkipped", testSkipped, "userSecondTestAttempts", testAttempts)
        } catch (error) {
            console.error(error);

            setTimeout(async () => {
                await mainDb.updateUserTests(userId, "userSecondTestPassed", testPassed, "userSecondTestSkipped", testSkipped, "userSecondTestAttempts", testAttempts)
            }, 90000000);
        }
        try {
            if (ctx.session.userRate !== 'basic') {
                await ctx.replyWithPhoto({source: './assets/images/lesson3.jpg'}, {
                    protect_content: true,
                    caption: messages.thirdLessonProAdvancedIntroMessage.ru,
                    ...keyboards.thirdLessonProAdvancedIntroKeyboard
                })
                setTimeout(async () => {
                    await ctx.replyWithDocument({source: './assets/images/formula2.png'}, {
                        disable_notification: true,
                        protect_content: true,
                        caption: messages.getFormulaMessage.ru,
                        ...keyboards.getAccessToChatKeyboard
                    })
                }, 10000);
            } else {
                await ctx.replyWithPhoto({source: './assets/images/lesson3.jpg'}, {
                    protect_content: true,
                    caption: messages.thirdLessonBasicIntroMessage.ru,
                    ...keyboards.thirdLessonBasicIntroKeyboard
                })

                setTimeout(async () => {
                    await ctx.replyWithDocument({source: './assets/images/formula1.png'}, {
                        disable_notification: true,
                        protect_content: true,
                        caption: messages.getFormulaMessage.ru,
                        ...keyboards.getAccessToChatKeyboard
                    })
                }, 10000);
            }

            
        } catch (error) {
            console.error(error);
            
        }
        try {
            
        } catch (error) {
            console.error(error);
            await ctx.reply(messages.techProblemsMessage.ru)
        }
    })
}
async function sessionRegisterHandler(ctx) {
    console.log("works307");
    app.post('/sign-up-register', async (req, res) => {
        console.log("works309");
        const { userId, userAnswName, userAnswInst, userAnswWhoAreYou, userAnswAim, userAnswAimRealize, userAnswWeaknesses, userAnswClient } = req.body
        try {
            await mainDb.updateUserPersonalAnswersInfo(userId, userAnswName, userAnswInst, userAnswWhoAreYou, userAnswAim, userAnswAimRealize, userAnswWeaknesses, userAnswClient)
        } catch (error) {
            console.error(error);
            setTimeout(async () => {
                await mainDb.updateUserPersonalAnswersInfo(userId, userAnswName, userAnswInst, userAnswWhoAreYou, userAnswAim, userAnswAimRealize, userAnswWeaknesses, userAnswClient)
            }, 90000000);
        }

        try {
            ctx.replyWithHTML(messages.proAdvancedFinalMessage.ru)
        } catch (error) {
            console.error(error);
            ctx.replyWithHTML(messages.techProblemsMessage.ru)
        }

        try {
            const botFinishTime = functions.getCurrentTimeString()
            await mainDb.updateUserParameter(userId, "userBotFinishTime", botFinishTime)
            await mainDb.updateUserParameter(userId, "userWaitingForSession", true)
            await mainDb.updateUserParameter(userId, "userWaitingForSessionTime", botFinishTime)
        } catch (error) {
            console.error(error);
        }

    })
}



//------------------------------------------------------------------

bot.start(async (ctx) => {
    const userId = ctx.from.id
    const userName = ctx.from.username ? ctx.from.username : 'none'
    const botStartTime = functions.getCurrentTimeString()
    //ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ В БД
    //В БД СОЗДАЁТСЯ ПОЛНАЯ СХЕМА ПОЛЕЙ
    try {
        await mainDb.createUserDocument(userId, userName, botStartTime)
    } catch (error) {
        console.error(error);
        setTimeout(async () => {
            await mainDb.createUserDocument(userId, userName, botStartTime)
        }, 90000000);
    }
    //---------------------------------

    ctx.session.userName = userName
    ctx.session.timeOut1 = true
    ctx.session.timeOut2 = true
    ctx.session.timeOut3 = true
    ctx.session.timeOut4 = true
    ctx.session.timeOut5 = true
    ctx.session.timeOut6 = true
    ctx.session.timeOut7 = true
    

    try {
        await ctx.replyWithPhoto({source: './assets/images/welcome.jpg'}, {
            protect_content: true,
            caption: messages.botWelcomeMessage.ru,
            ...keyboards.welcomeMessageKeyboard
        })
    } catch (error) {
        console.error(error);
        await ctx.replyWithHTML(messages.techProblemsMessage.ru)
    }

    setTimeout(async () => {
        if (ctx.session.timeOut1) {
            await ctx.replyWithHTML(messages.prePaymentVideoAdvmessage.ru, {
                protect_content: true,
                ...keyboards.welcomeVideoAdvKeyboard
            })

            setTimeout(async () => {
                if (ctx.session.timeOut2) {
                    await ctx.replyWithVideo({source: './assets/images/adv_video.mp4'}, {
                        protect_content: true,
                        caption: messages.ratesDescriptionWithVideoMessage.ru,
                        ...keyboards.chooseRateWebAppKeyboard
                    })
                    rateChosenHandler(ctx, app)
        
                    setTimeout(async () => {
                        if (ctx.session.timeOut4) {
                            await ctx.replyWithHTML(messages.needHelpChoosingRateMessage.ru, keyboards.chooseRateWebAppKeyboard)
                            rateChosenHandler(ctx)
                        }
                    }, 30000);
                }
            }, 30000);
        }
    }, 30000); //! ПОМЕНЯТЬ НА 10 МИНУТ

})

const ignoreEvents = ['photo', 'video', 'voice', 'document', 'text'];

bot.on(ignoreEvents, (ctx, next) => {
    
});


bot.action("botWelcomeMessage-prePaymentVideoAdvMessage", async (ctx) => {
    const userId = ctx.from.id
    ctx.session.timeOut1 = false

    try {
        await ctx.replyWithHTML(messages.prePaymentVideoAdvmessage.ru, keyboards.welcomeVideoAdvKeyboard)
        setTimeout(async () => {
            if (ctx.session.timeOut2) {
                await ctx.replyWithVideo({source: './assets/images/adv_video.mp4'}, {
                    protect_content: true,
                    caption: messages.ratesDescriptionWithVideoMessage.ru,
                    ...keyboards.chooseRateWebAppKeyboard
                })
                rateChosenHandler(ctx)
    
                setTimeout(async () => {
                    if (ctx.session.timeOut4) {
                        await ctx.replyWithHTML(messages.needHelpChoosingRateMessage.ru, keyboards.chooseRateWebAppKeyboard)
                        rateChosenHandler(ctx)
                    }
                }, 30000);
            }
        }, 30000);
    } catch (error) {
        console.error(error);
        await ctx.replyWithHTML(messages.techProblemsMessage.ru)
    }

})


bot.action("prePaymentVideoAdvMessage-authorInfoWithPicMessage", async (ctx) => {
    const userId = ctx.from.id
    ctx.session.timeOut2 = false
    try {
        await ctx.replyWithPhoto({source: './assets/images/author_info.jpg'}, {
            protect_content: true,
            caption: messages.authorInfoWithPicMessage.ru,
        })
        setTimeout(async () => {
            await ctx.replyWithHTML(messages.authorInfoNoPicMessage.ru, keyboards.authorInfoNoPicMessageKeyboard)
            setTimeout(async () => {
                if (ctx.session.timeOut3) {
                    await ctx.replyWithVideo({source: './assets/images/adv_video.mp4'}, {
                        caption: messages.ratesDescriptionWithVideoMessage.ru,
                        ...keyboards.chooseRateWebAppKeyboard
                    })
                    rateChosenHandler(ctx)

                    setTimeout(async () => {
                        if (ctx.session.timeOut4) {
                            await ctx.replyWithHTML(messages.needHelpChoosingRateMessage.ru, keyboards.chooseRateWebAppKeyboard)
                            rateChosenHandler(ctx)
                        }
                    }, 30000);
                }
            }, 30000); //! ПОМЕНЯТЬ НА 10 МИНУТ
        }, 5000);
    } catch (error) {
        console.error(error);
        await ctx.replyWithHTML(messages.techProblemsMessage.ru)
    }
})

const actions = ["authorInfoWithPicMessage-ratesDescriptionWithVideoMessage"]
bot.action(actions, async (ctx) => {
    const userId = ctx.from.id
    ctx.session.timeOut3 = false
    ctx.session.timeOut2 = false
    try {
        await ctx.replyWithVideo({source: './assets/images/adv_video.mp4'}, {
            caption: messages.ratesDescriptionWithVideoMessage.ru,
            ...keyboards.chooseRateWebAppKeyboard
        })
        rateChosenHandler(ctx)
        setTimeout(async () => {
            if (ctx.session.timeOut4) {
                await ctx.replyWithHTML(messages.needHelpChoosingRateMessage.ru, keyboards.chooseRateWebAppKeyboard)
                rateChosenHandler(ctx)
            }
        }, 30000);
    } catch (error) {
        console.error(error);
        await ctx.replyWithHTML(messages.techProblemsMessage.ru)
    }
})

bot.action("prePaymentVideoAdvmessage-noPaymentFinalMessage", async (ctx) => {
    const userId = ctx.from.id
    ctx.session.timeOut3 = false
    ctx.session.timeOut2 = false


    try {
        await ctx.replyWithHTML(messages.noPaymentFinalMessage.ru)
    } catch (error) {
        console.error(error);
        await ctx.replyWithHTML(messages.techProblemsMessage.ru)
    }
})


bot.action("paymentLinkMessage-needHelpMessage", async (ctx) => {
    const userId = ctx.from.id

    try {
        await ctx.replyWithHTML(messages.needHelpMessage.ru)
    } catch (error) {
        console.error(error);
        await ctx.replyWithHTML(messages.techProblemsMessage.ru)
    }
})


bot.action("authorInfoNoPicMessage-getPaymentLinkMessage", async (ctx) => {
    const userId = ctx.from.id

    try {
        await ctx.replyWithHTML(messages.paymentLinkMessage.ru + paymentLinks[ctx.session.userRate], keyboards.paymentLinkKeyboard)
    } catch (error) {
        console.error(error);
        await ctx.replyWithHTML(messages.techProblemsMessage)
    }
})


bot.action('successPaymentMessage-firstLessonVideoIntroMessage', async (ctx) => {
    const userId = ctx.from.id
    ctx.session.timeOut1 = false
    ctx.session.timeOut2 = false
    ctx.session.timeOut3 = false
    ctx.session.timeOut4 = false
    ctx.session.timeOut5 = false
    try {
        await ctx.replyWithPhoto({source: './assets/images/lesson1.jpg'}, {
            protect_content: true,
            caption: messages.firstLessonVideoIntroMessage.ru,
            ...keyboards.firstLessonVideoIntroKeyboard
        })
    } catch (error) {
        console.error(error);
        await ctx.replyWithHTML(messages.techProblemsMessage)
    }
    firstTestHandler(ctx)
    setTimeout(async () => {
        await ctx.replyWithPhoto({source: './assets/images/test1.jpg'}, {
            disable_notification: true,
            protect_content: true,
            caption: messages.firstLessonTestStartMessage.ru,
            ...keyboards.firstLessonTestStartKeyboard
        })
    }, 10000);
})


bot.action('getFormulaMessage-chatLink', async (ctx) => {
    const userId = ctx.from.id
    sessionRegisterHandler(ctx)
    try {
        await ctx.replyWithHTML("https://t.me/+vRPrDecgJ5k1MmFi", {
            protect_content: true
        })
    } catch (error) {
        console.error(error);
        await ctx.replyWithHTML(messages.techProblemsMessage.ru)
    }
    if (ctx.session.userRate === 'pro') {    
        sessionRegisterHandler(ctx)    
        setTimeout(async () => {
            try {
                await ctx.replyWithHTML(messages.signUpForSessionIntroMessage.ru, keyboards.signUpForSessionIntroKeyboard)
            } catch (error) {
                console.error(error);
                await ctx.replyWithHTML(messages.techProblemsMessage.ru)
            }
        }, 5000);
    } else if (ctx.session.userRate === 'advanced') {
        try {
            await ctx.replyWithVideo({source: './assets/special_offers/special_advanced.mp4'}, {
                protect_content: true,
                caption: messages.advancedUpgradeOfferMessage.ru,
                ...keyboards.advancedUpgradeOfferKeyboard
            })

            setTimeout(async () => {
                if (ctx.session.timeOut6) {
                    await ctx.replyWithHTML(messages.advancedUpgradeNoPaymentMessage.ru, keyboards.advancedUpgradeNoPaymentKeyboard)
                }
            }, 30000);
        } catch (error) {
            
        }
    } else {
        try {
            await ctx.replyWithVideo({source: './assets/special_offers/special_basic.mp4'}, {
                protect_content: true,
                caption: messages.basicUpgradeOfferMessage.ru,
                ...keyboards.basicUpgradeChooseRateKeyboard
            })
        } catch (error) {
            console.error(error);
            await ctx.replyWithHTML(messages.techProblemsMessage.ru)
        }
    }
})


bot.action("basicUpgradeOfferMessage-basicUpgradeToProPaymentMessage", async (ctx) => {
    const userId = ctx.from.id
    paymentSuccessHandler(ctx)
    try {
        await ctx.replyWithHTML(messages.basicUpgradeToProPaymentMessage.ru, keyboards.basicUpgradePaymentLinkProKeyboard)
    } catch (error) {
        console.error(error);
        await ctx.replyWithHTML(messages.techProblemsMessage.ru)
    }
})

bot.action("basicUpgradeOfferMessage-basicUpgradeToAdvancedPaymentMessage", async (ctx) => {
    const userId = ctx.from.id
    paymentSuccessHandler(ctx)
    try {
        await ctx.replyWithHTML(messages.basicUpgradeToAdvancedPaymentMessage.ru, keyboards.basicUpgradePaymentLinkAdvancedKeyboard)
    } catch (error) {
        console.error(error);
        await ctx.replyWithHTML(messages.techProblemsMessage.ru)
    }
})










app.get('/choose-rate', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'choose_rate', 'offers.html'));
});
app.use('/choose-rate', express.static(path.join(__dirname, 'public', 'choose_rate')));

app.get('/check-primary-payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'check_payment', 'check_payment.html'));
});
app.use('/check-primary-payment', express.static(path.join(__dirname, 'public', 'check_payment')));

app.get('/test-one', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test_one', 'test_one.html'));
});
app.use('/test-one', express.static(path.join(__dirname, 'public', 'test_one')));

app.get('/test-two', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test_two', 'test_two.html'));
});
app.use('/test-two', express.static(path.join(__dirname, 'public', 'test_two')));

app.get('/check-adv-pro-payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'check_payment_adv_pro', 'check_payment_adv_pro.html'));
});
app.use('/check-adv-pro-payment', express.static(path.join(__dirname, 'public', 'check_payment_adv_pro')));

app.get('/check-bas-adv-payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'check_payment_bas_adv', 'check_payment_bas_adv.html'));
});
app.use('/check-bas-adv-payment', express.static(path.join(__dirname, 'public', 'check_payment_bas_adv')));

app.get('/check-bas-pro-payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'check_payment_bas_pro', 'check_payment_bas_pro.html'));
});
app.use('/check-bas-pro-payment', express.static(path.join(__dirname, 'public', 'check_payment_bas_pro')));

app.get('/session-register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'session_sign_up', 'session_sign_up.html'));
});
app.use('/session-register', express.static(path.join(__dirname, 'public', 'session_sign_up')));







app.post("/check-user-primary-payment", async (req, res) => {
    const { userEmailOrPhone } = req.body
    const clearedEmail = userEmailOrPhone.toLowerCase().trim();

    await mainDb.findUserPrimaryPayment(clearedEmail)
    .then(data => {
        if (data.error) {
            res.send({
                data: "error"
            })
        } else {
            res.send({
                data: {
                    result: "success",
                    userEmail: clearedEmail,
                    userPhone: data.userPhone,
                    userName: data.userName,
                    paymentPrice: data.paymentPrice,
                    productId: data.productId
                }
            })
        }
    })
})





//!НЕ ТРОГАТЬ
app.post('/webhook', async (req, res) => {
    const webhookKeyFromHeaders = req.headers['webhook-key'];
    
    if (webhookKeyFromHeaders !== "9187CC74AD93C42A2A101E147095919A093F07CE334638BABBD620B21F089A46") {
      console.error("Invalid webhook key.");
      return res.status(401).send("Invalid webhook key.");
    } else {
      const webhookData = req.body;
      const userName = webhookData.customer_name || "none" 
      const userPhone = webhookData.customer_phone || "none"
      const userEmail = webhookData.customer_email || "none"
      const productId = webhookData.product_id || "none"
      const paymentPrice = webhookData.total_amount || "none"
  
      await addUserAfterPaymentToFirestore(`${userEmail}`, `${userName}`, `${userPhone}`, `${paymentPrice}`, `${productId}`)
  
  
      res.status(200).send("Webhook processed successfully.");
    }
});


async function addUserAfterPaymentToFirestore(userEmail, userName, userPhone, paymentPrice, productId) {
    const db = admin.firestore();
  
    try {
      // Создаем документ с названием userEmail
      const userDocRef = db.collection('paymentKeys').doc(userEmail);
  
      // Добавляем поля в документ
      await userDocRef.set({
        userName: userName || "none",
        userPhone: userPhone || "none",
        paymentPrice: paymentPrice || "none",
        productId: productId || "none"
      });
      
      console.log(`Пользователь успешно добавлен в Firestore: ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Ошибка при добавлении пользователя в Firestore:', error);
      return false;
    }
}

//!НЕ ТРОГАТЬ




const option = {dropPendingUpdates: true}
bot.launch(option)
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});