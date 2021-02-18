/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */

  static URL = '';

  static list(data, callback){
    return createRequest({
      url: this.URL,
      method: 'GET',
      responseType: 'json',
      data,
      callback
    });
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    return createRequest({
      url: this.URL,
      data,
      responseType: 'json',
      method: 'PUT',
      callback
    });
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(id, callback ) {
    return createRequest({
      url: this.URL,
      data: {id},
      responseType: 'json',
      method: 'DELETE',
      callback
    });
  }
}
