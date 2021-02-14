/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.user  = JSON.stringify(user);
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem(user);
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    return JSON.parse(localStorage.user);
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    return createRequest({
      url: '/user' + '/current',
      data: {},
      // responseType: 'json',
      method: 'GET',
      callback: (err, response) => {
        if (response && response.user) {
          User.setCurrent(response.user);
        } else {
          this.unsetCurrent();
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login( data, callback) {
    createRequest({
      url: '/user' + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register( data, callback) {
    createRequest({
      url: '/user' + '/register',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response.success === true) {
          User.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout( data, callback) {
    createRequest({
      url: '/user' + '/logout',
      method: 'POST',
      responseType: 'json',
      data: {},
      callback: (err, response) => {
        if (response.success === true) {
          this.unsetCurrent();
        }
        callback(err, response);
      }
    });
  }
}
