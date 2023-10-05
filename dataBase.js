var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKeys.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore()

async function addUser(userId, userName, userRate) {
    // Получить доступ к коллекции users.
    const usersCollection = db.collection("users");
  
    // Создать документ с именем userId.
    const userDoc = usersCollection.doc(userId);
  
    // Добавить данные в документ.
    await userDoc.set({
      name: userName,
      rate: userRate
    });
}

  async function addParameter(userId, key, value) {
    // Получить доступ к коллекции users.
    const usersCollection = db.collection("users");
  
    // Создать документ с именем userId.
    const userDoc = usersCollection.doc(userId);

    //Добавить параметр в документ.
    await userDoc.update({
        [key]: value,
    });
}

async function addLinksEmpty(userId, key1, value1, key2, value2, key3, value3, key4, value4, key5, value5) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Создать документ с именем userId.
  const userDoc = usersCollection.doc(userId);

  // Добавить параметры в документ.
  await userDoc.update({
      [key1]: value1,
      [key2]: value2,
      [key3]: value3,
      [key4]: value4,
      [key5]: value5
  });
}

async function addBasicUpgradeLinks(userId, key1, value1, key2, value2) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Создать документ с именем userId.
  const userDoc = usersCollection.doc(userId);

  // Добавить параметры в документ.
  await userDoc.update({
      [key1]: value1,
      [key2]: value2
  });
}




async function addPaymentInfo(userId, paymentStatusKey, paymentStatusValue, paymentDateKey, paymentDateValue) {
    // Получить доступ к коллекции users.
    const usersCollection = db.collection("users");
  
    // Создать документ с именем userId.
    const userDoc = usersCollection.doc(userId);

    // Добавить параметры в документ.
    await userDoc.update({
        [paymentStatusKey]: paymentStatusValue,
        [paymentDateKey]: paymentDateValue
    });
}

async function addFirstTestPassedCurrent(userId, key, value) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Создать документ с именем userId.
  const userDoc = usersCollection.doc(userId);

  //Добавить параметр в документ.
  await userDoc.update({
      [key]: value,
  });
}

async function addSecondTestPassedCurrent(userId, key, value) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Создать документ с именем userId.
  const userDoc = usersCollection.doc(userId);

  //Добавить параметр в документ.
  await userDoc.update({
      [key]: value,
  });
}
  

async function getRate(userId) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Получить документ с именем userId.
  const userDoc = await usersCollection.doc(userId).get();

  // Если документ не существует, вернуть null.
  if (!userDoc.exists) {
      return null;
  }

  // Вернуть значение rate.
  return userDoc.data().rate;
}

async function getFirstLink(userId) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Получить документ с именем userId.
  const userDoc = await usersCollection.doc(userId).get();

  // Если документ не существует, вернуть null.
  if (!userDoc.exists) {
      return null;
  }

  // Вернуть значение rate.
  return userDoc.data().firstVideoLink;
}

async function getSecondLink(userId) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Получить документ с именем userId.
  const userDoc = await usersCollection.doc(userId).get();

  // Если документ не существует, вернуть null.
  if (!userDoc.exists) {
      return null;
  }

  // Вернуть значение rate.
  return userDoc.data().secondVideoLink;
}

async function getThirdLink(userId) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Получить документ с именем userId.
  const userDoc = await usersCollection.doc(userId).get();

  // Если документ не существует, вернуть null.
  if (!userDoc.exists) {
      return null;
  }

  // Вернуть значение rate.
  return userDoc.data().thirdVideoLink;
}


async function getLinkFourBtoA(userId) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Получить документ с именем userId.
  const userDoc = await usersCollection.doc(userId).get();

  // Если документ не существует, вернуть null.
  if (!userDoc.exists) {
      return null;
  }

  // Вернуть значение rate.
  return userDoc.data().videoFourBtoALink;
}

async function getLinkFourBtoP(userId) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Получить документ с именем userId.
  const userDoc = await usersCollection.doc(userId).get();

  // Если документ не существует, вернуть null.
  if (!userDoc.exists) {
      return null;
  }

  // Вернуть значение rate.
  return userDoc.data().videoFourBtoPLink;
}


async function getFirstTestPassed(userId) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Получить документ с именем userId.
  const userDoc = await usersCollection.doc(userId).get();

  // Если документ не существует, вернуть null.
  if (!userDoc.exists) {
      return null;
  }

  // Вернуть значение rate.
  return userDoc.data().firstTestPassed;
}

async function getSecondTestPassed(userId) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Получить документ с именем userId.
  const userDoc = await usersCollection.doc(userId).get();

  // Если документ не существует, вернуть null.
  if (!userDoc.exists) {
      return null;
  }

  // Вернуть значение rate.
  return userDoc.data().secondTestPassed;
}


async function addUserPersonalInfo(userId, userFullNameKey, userFullNameValue, userInstNameKey, userInstNameValue, userWhoAreYouKey, userWhoAreYouValue, userAimKey, userAimValue, userRealizeAimKey, userRealizeAimValue, userWeaknessesKey, userWeaknessesValue, userClientKey, userClientValue) {
  // Получить доступ к коллекции users.
  const usersCollection = db.collection("users");

  // Создать документ с именем userId.
  const userDoc = usersCollection.doc(userId);

  // Добавить параметры в документ.
  await userDoc.update({
      [userFullNameKey]: userFullNameValue,
      [userInstNameKey]: userInstNameValue,
      [userWhoAreYouKey]: userWhoAreYouValue,
      [userAimKey]: userAimValue,
      [userRealizeAimKey]: userRealizeAimValue,
      [userWeaknessesKey]: userWeaknessesValue,
      [userClientKey]: userClientValue
  });
}


async function watchFirstTestPassed(userId, callback) {
  if (!userId) {
    console.error("No userId provided!");
    return;
  }

  const usersCollection = db.collection("users");

  // Объявляем переменную unsubscribe в начале
  let unsubscribe;

  // Затем, когда вы вызываете onSnapshot, вы присваиваете ей возвращаемую функцию отписки
  unsubscribe = usersCollection.doc(userId).onSnapshot(snapshot => {
    const userData = snapshot.data();

    if (userData && userData.firstTestPassed === true) {
      callback();
      // Используем функцию отписки, когда условие выполняется
      unsubscribe();
    }
  });
}



async function watchUserFirstTestCount(userId, callback) {
  if (!userId) {
    console.error("No userId provided!");
    return;
  }

  const usersCollection = db.collection("users");

  // Объявляем переменную unsubscribe в начале
  let unsubscribe;

  // Затем, когда вы вызываете onSnapshot, вы присваиваете ей возвращаемую функцию отписки
  unsubscribe = usersCollection.doc(userId).onSnapshot(snapshot => {
    const userData = snapshot.data();

    if (userData && userData.firstTestCount === 4) {
      // Если значение firstTestCount равно 4, вызываем callback-функцию
      callback();

      // Используем функцию отписки, когда условие выполняется
      unsubscribe();
    }
  });
}




async function watchSecondTestPassed(userId, callback) {
  if (!userId) {
    console.error("No userId provided!");
    return;
  }
  const usersCollection = db.collection("users");

  // Объявляем переменную unsubscribe в начале
  let unsubscribe;

  // Затем, когда вы вызываете onSnapshot, вы присваиваете ей возвращаемую функцию отписки
  unsubscribe = usersCollection.doc(userId).onSnapshot(snapshot => {
    const userData = snapshot.data();

    if (userData && userData.secondTestPassed === true) {
      callback();
      // Используем функцию отписки, когда условие выполняется
      unsubscribe();
    }
  });
}

async function watchUserSecondTestCount(userId, callback) {
  if (!userId) {
    console.error("No userId provided!");
    return;
  }

  const usersCollection = db.collection("users");

  // Объявляем переменную unsubscribe в начале
  let unsubscribe;

  // Затем, когда вы вызываете onSnapshot, вы присваиваете ей возвращаемую функцию отписки
  unsubscribe = usersCollection.doc(userId).onSnapshot(snapshot => {
    const userData = snapshot.data();

    if (userData && userData.secondTestCount === 4) {
      // Если значение secondTestCount равно 4, вызываем callback-функцию
      callback();

      // Используем функцию отписки, когда условие выполняется
      unsubscribe();
    }
  });
}




module.exports = {
    addUser,
    addParameter,
    addPaymentInfo,
    getRate,
    addFirstTestPassedCurrent,
    addUserPersonalInfo,
    addSecondTestPassedCurrent,
    getFirstTestPassed,
    getSecondTestPassed,
    getFirstLink,
    getSecondLink,
    getThirdLink,
    watchFirstTestPassed,
    watchUserFirstTestCount,
    watchSecondTestPassed,
    watchUserSecondTestCount,
    addLinksEmpty,
    addBasicUpgradeLinks,
    getLinkFourBtoA,
    getLinkFourBtoP
}