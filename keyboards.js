const { Markup } = require('telegraf')

const webAppLink = "http://194.87.98.93:3000"

const welcomeMessageKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('Научиться за 58 минут🚀', 'botWelcomeMessage-prePaymentVideoAdvMessage')]
]);

const welcomeVideoAdvKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('Расскажи подробнее👀', 'prePaymentVideoAdvMessage-authorInfoWithPicMessage')],
    [Markup.button.callback('Хочу научиться🎓', 'prePaymentVideoAdvmessage-ratesDescriptionWithVideoMessage')]
]);

const authorInfoNoPicMessageKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('Хочу научиться🎓', 'authorInfoWithPicMessage-ratesDescriptionWithVideoMessage')]
]);

const chooseRateWebAppKeyboard = Markup.inlineKeyboard([
    [Markup.button.webApp("Выбрать тариф🎁", `${webAppLink}/choose-rate`)]
]);

const paymentLinkKeyboard = Markup.inlineKeyboard([
    [Markup.button.webApp("Проверить оплату💸", `${webAppLink}/check-primary-payment`)],
    [Markup.button.callback('Задать вопрос❓', 'paymentLinkMessage-needHelpMessage')]
]);

const paymentIssuesKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('ТЫ КТО чтоб так базарить?😡', 'prePaymentVideoAdvmessage-authorInfoWithPicMessage')],
    [Markup.button.callback('Не в этом дело🙃', 'prePaymentVideoAdvmessage-noPaymentFinalMessage')],
    [Markup.button.webApp("Проверить оплату💸", `${webAppLink}/check-primary-payment`)]
]);

const getBackToPayment = Markup.inlineKeyboard([
    [Markup.button.callback('Вернуться к оплате💸', 'authorInfoNoPicMessage-getPaymentLinkMessage')]
]);

const successPaymentKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('Оплата есть. Погружаемся!🎉', 'successPaymentMessage-firstLessonVideoIntroMessage')]
]);

const firstLessonVideoIntroKeyboard = Markup.inlineKeyboard([
    [Markup.button.url('Смотреть видео🖥', 'https://www.youtube.com/')]
]);

const firstLessonTestStartKeyboard = Markup.inlineKeyboard([
    [Markup.button.webApp("Проверить знания📝", `${webAppLink}/test-one`)]
]);

const secondLessonVideoIntroKeyboard = Markup.inlineKeyboard([
    [Markup.button.url('Смотреть видео🖥', 'https://www.youtube.com/')]
]);

const secondLessonTestStartKeyboard = Markup.inlineKeyboard([
    [Markup.button.webApp("Проверить знания📝", `${webAppLink}/test-two`)]
]);

const thirdLessonProAdvancedIntroKeyboard = Markup.inlineKeyboard([
    [Markup.button.url('Смотреть видео🖥', 'https://www.youtube.com/')]
]);

const thirdLessonBasicIntroKeyboard = Markup.inlineKeyboard([
    [Markup.button.url('Смотреть видео🖥', 'https://www.youtube.com/')]
]);

const getAccessToChatKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('Получить доступ в чат!💬', 'getFormulaMessage-chatLink')]
]);

const signUpForSessionIntroKeyboard = Markup.inlineKeyboard([
    [Markup.button.webApp("Записаться на сессию✍️", `${webAppLink}/session-register`)]
]);

const advancedUpgradeOfferKeyboard = Markup.inlineKeyboard([
    [Markup.button.webApp("Проверить оплату💸", `${webAppLink}/check-adv-pro-payment`)],
    [Markup.button.callback('Задать вопрос❓', 'paymentLinkMessage-needHelpMessage')]
]);

const advancedUpgradeNoPaymentKeyboard = Markup.inlineKeyboard([
    [Markup.button.webApp("Проверить оплату💸", `${webAppLink}/check-adv-pro-payment`)]
]);

const basicUpgradePaymentLinkAdvancedKeyboard = Markup.inlineKeyboard([
    [Markup.button.webApp("Проверить оплату💸", `${webAppLink}/check-bas-adv-payment`)]
]);

const basicUpgradePaymentLinkProKeyboard = Markup.inlineKeyboard([
    [Markup.button.webApp("Проверить оплату💸", `${webAppLink}/check-bas-pro-payment`)]
]);

const fourthLessonBasicIntroKeyboard = Markup.inlineKeyboard([
    [Markup.button.url('Смотреть видео🖥', 'https://www.youtube.com/')]
]);

const basicUpgradeChooseRateKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('1️⃣PRO', 'basicUpgradeOfferMessage-basicUpgradeToProPaymentMessage')],
    [Markup.button.callback('2️⃣ADVANCED', 'basicUpgradeOfferMessage-basicUpgradeToAdvancedPaymentMessage')]
]);





module.exports = {
    welcomeMessageKeyboard,
    welcomeVideoAdvKeyboard,
    authorInfoNoPicMessageKeyboard,
    chooseRateWebAppKeyboard,
    paymentLinkKeyboard,
    paymentIssuesKeyboard,
    successPaymentKeyboard,
    firstLessonVideoIntroKeyboard,
    firstLessonTestStartKeyboard,
    secondLessonVideoIntroKeyboard,
    secondLessonTestStartKeyboard,
    thirdLessonProAdvancedIntroKeyboard,
    thirdLessonBasicIntroKeyboard,
    getAccessToChatKeyboard,
    signUpForSessionIntroKeyboard,
    advancedUpgradeOfferKeyboard,
    advancedUpgradeNoPaymentKeyboard,
    basicUpgradePaymentLinkAdvancedKeyboard,
    basicUpgradePaymentLinkProKeyboard,
    fourthLessonBasicIntroKeyboard,
    basicUpgradeChooseRateKeyboard,
    getBackToPayment
}

