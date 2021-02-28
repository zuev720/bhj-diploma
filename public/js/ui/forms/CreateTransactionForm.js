/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super (element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(User.current(), (err, response) => {
      if (response) {
        this.element.querySelector('.accounts-select').innerHTML = '';
        response.data.forEach(account => {
          let options = () => {
            return `<option value="${account.id}">${account.name}</option>`;
          }
          this.element.querySelector('.accounts-select').insertAdjacentHTML("afterbegin", options());
        });
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response) {
        const activeForm = new Modal(this.element.closest('.modal'));
        activeForm.close();
        this.element.reset();
        App.updateWidgets();
      }
    });
  }
}