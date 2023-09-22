const { Markup } = require('telegraf');



const chooseLanguageKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('RU🇷🇺', 'russian_language_button')],
    [Markup.button.callback('EN🇬🇧', 'english_language_button')]
]);

const checkPaymentKeyboard_ru = Markup.inlineKeyboard([
    [Markup.button.callback('Оплатить💵', 'payment_check_button')]
  ]);
  const checkPaymentKeyboard_en = Markup.inlineKeyboard([
    [Markup.button.callback('Pay💵', 'payment_check_button')]
  ]);


  const chooseRateKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('PRO', 'payment_pro_rate_button')],
    [Markup.button.callback('ADVANCED', 'payment_advanced_rate_button')],
    [Markup.button.callback('BASIC', 'payment_basic_rate_button')]
  ]);


const paymentSuccessKeyboard = {
    "ru": Markup.inlineKeyboard([
        [Markup.button.callback('Оплата есть. Погружаемся!🎉', 'payment_success_button')]
      ]),
    "en": Markup.inlineKeyboard([
        [Markup.button.callback("Payment received. Let's dive in!🎉", 'payment_success_button')]
      ])
}

const goToFirstVideoKeyboard = {
    "ru": Markup.inlineKeyboard([
        [Markup.button.callback('Смотреть урок №1🖥', 'watch_lessons_one_button')]
      ]),
    "en": Markup.inlineKeyboard([
        [Markup.button.callback('Watch Lesson №1🖥', 'watch_lessons_one_button')]
      ])
}

const watchedFirstVideoKeyboard = {
    "ru": Markup.inlineKeyboard([
        [Markup.button.callback('Закончил смотреть видео🎉', 'first_video_finished_button')]
      ]),
    "en": Markup.inlineKeyboard([
        [Markup.button.callback('Finished watching the video🎉', 'first_video_finished_button')]
      ])
}

const startFirstTestKeyboard = {
    "ru": Markup.inlineKeyboard([
        [Markup.button.webApp('Проверить знания📚', `https://azhypa-web-apps.onrender.com/test_one`)]
      ]),
    "en": Markup.inlineKeyboard([
        [Markup.button.webApp('Check knowledge📚', `https://azhypa-web-apps.onrender.com/test_one`)]
      ])
}

const firstTestSkipKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Пропустить тест➡️', 'first_test_skip_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Skip the test➡️', 'first_test_skip_button')]
    ])
}

const secondTestSkipKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Пропустить тест➡️', 'second_test_skip_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Skip the test➡️', 'second_test_skip_button')]
    ])
}



const introSecondLessonKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Смотреть урок №2🖥', 'watch_lesson_two_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Смотреть урок №2🖥', 'watch_lesson_two_button')]
    ])
}

const watchedSecondVideoKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Закончил смотреть видео🎉', 'second_video_finished_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Finished watching the video🎉', 'second_video_finished_button')]
    ])
}

const startSecondTestKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.webApp('Проверить знания📚', `https://azhypa-web-apps.onrender.com/test_two`)]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.webApp('Check knowledge📚', `https://azhypa-web-apps.onrender.com/test_two`)]
    ])
}



const introThirdLessonKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Смотреть урок №3🖥', 'watch_lesson_three_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Смотреть урок №3🖥', 'watch_lesson_three_button')]
    ])
}

const getMaterialsKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Получить материалы📩', 'get_materials_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Get materials📩', 'get_materials_button')]
    ])
}

const getAccessToChatKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Получить доступ в чат👨‍👩‍👧‍👧', 'get_access_to_chat_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Access the chat👨‍👩‍👧‍👧', 'get_access_to_chat_button')]
    ])
}

const joinedChatKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Вступил в чат🎉', 'joined_chat_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Joined the chat!🎉', 'joined_chat_button')]
    ])
}

const startSignUpForSessionKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Готов ответить✍️', 'start_sign_up_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Ready to provide answers✍️', 'start_sign_up_button')]
    ])
}

const checkAnswersKeyboard = {
  "ru": Markup.inlineKeyboard([
    [Markup.button.callback('Ответы верные✅', 'answers_are_right_button')],
    [Markup.button.callback('Ввести данные ещё раз🔄', 'give_data_again_button')]
    ]),
  "en": Markup.inlineKeyboard([
    [Markup.button.callback('Answers are correct✅', 'answers_are_right_button')],
    [Markup.button.callback('Enter data again🔄', 'give_data_again_button')]
    ])
}

const advancedToProUpgradeOfferKeyboard = {
  "ru": Markup.inlineKeyboard([
    [Markup.button.callback('Оплатить💵', 'upgrade_to_pro_button')]
    ]),
  "en": Markup.inlineKeyboard([
    [Markup.button.callback('Pay💵', 'upgrade_to_pro_button')]
    ])
}

const basicUpgradeOfferKeyboard = {
  "ru": Markup.inlineKeyboard([
    [Markup.button.callback('Апгрейд до PRO💵', 'basic_to_pro_upgrade_button')],
    [Markup.button.callback('Апгрейд до ADVANCED💵', 'basic_to_advanced_upgrade_button')]
    ]),
  "en": Markup.inlineKeyboard([
    [Markup.button.callback('Upgrade to PRO💵', 'basic_to_pro_upgrade_button')],
    [Markup.button.callback('Upgrade to ADVANCED💵', 'basic_to_advanced_upgrade_button')]
    ])
}

const basicToProVideoFourKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Смотреть урок №4🖥', 'basic_to_pro_video_four_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Смотреть урок №4🖥', 'basic_to_pro_video_four_button')]
    ])
}


const basicToProGetFormulaKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Получить материалы📩', 'basic_to_pro_get_formula_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Get materials📩', 'basic_to_pro_get_formula_button')]
    ])
}

const basicToProGiveInfoKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Перейти к записи на сессию', 'basic_to_pro_sign_up_session_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Sign up for session', 'basic_to_pro_sign_up_session_button')]
    ])
}

const basicToAdvancedVideoFourKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Смотреть урок №4🖥', 'basic_to_advanced_video_four_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Смотреть урок №4🖥', 'basic_to_advanced_video_four_button')]
    ])
}

const basicToAdvancedGetFormulaKeyboard = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Получить материалы📩', 'basic_to_advanced_get_formula_button')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('Get materials📩', 'basic_to_advanced_get_formula_button')]
    ])
}

const basicToAdvancedFinalMsg = {
  "ru": Markup.inlineKeyboard([
      [Markup.button.callback('Получил формулу', 'basic_to_advanced_final_msg')]
    ]),
  "en": Markup.inlineKeyboard([
      [Markup.button.callback('I got the formula', 'basic_to_advanced_final_msg')]
    ])
}


module.exports = {
    chooseLanguageKeyboard,
    checkPaymentKeyboard_ru,
    checkPaymentKeyboard_en,
    paymentSuccessKeyboard,
    goToFirstVideoKeyboard,
    watchedFirstVideoKeyboard,
    startFirstTestKeyboard,
    introSecondLessonKeyboard,
    introSecondLessonKeyboard,
    watchedSecondVideoKeyboard,
    startSecondTestKeyboard,
    chooseRateKeyboard,
    introThirdLessonKeyboard,
    getMaterialsKeyboard,
    getAccessToChatKeyboard,
    joinedChatKeyboard,
    startSignUpForSessionKeyboard,
    checkAnswersKeyboard,
    advancedToProUpgradeOfferKeyboard,
    basicUpgradeOfferKeyboard,
    basicToProVideoFourKeyboard,
    basicToProGetFormulaKeyboard,
    basicToProGiveInfoKeyboard,
    basicToAdvancedVideoFourKeyboard,
    basicToAdvancedGetFormulaKeyboard,
    basicToAdvancedFinalMsg,
    firstTestSkipKeyboard,
    secondTestSkipKeyboard
}