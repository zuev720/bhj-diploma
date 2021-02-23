/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
    /**
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * Сохраняет переданный элемент и регистрирует события
     * через registerEvents()
     * */
    constructor(element) {
        if (!element) {
            throw new Error('Ошибка, элемента не существует');
        } else {
            this.element = element;
            this.registerEvents();
        }
    }

    /**
     * Вызывает метод render для отрисовки страницы
     * */
    update() {
        this.render(this.lastOptions);
    }

    /**
     * Отслеживает нажатие на кнопку удаления транзакции
     * и удаления самого счёта. Внутри обработчика пользуйтесь
     * методами TransactionsPage.removeTransaction и
     * TransactionsPage.removeAccount соответственно
     * */
    registerEvents() {
        this.element.addEventListener('click', (e) => {
            let button = e.target.closest('.btn-danger');
            if (button) {
                if (button.classList.contains('remove-account')) {
                    this.removeAccount();
                } else if (button.classList.contains('transaction__remove')) {
                    this.removeTransaction(button.dataset.id);
                }
            }
        });
    }

    /**
     * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
     * Если пользователь согласен удалить счёт, вызовите
     * Account.remove, а также TransactionsPage.clear с
     * пустыми данными для того, чтобы очистить страницу.
     * По успешному удалению необходимо вызвать метод App.update()
     * для обновления приложения
     * */
    removeAccount() {
        if (!this.lastOptions) {
            return;
        }
        const agree = confirm('Вы действительно хотите удалить счёт?');
        if (agree) {
            let activeAccountId = [...document.querySelectorAll('.account')].find(account => account.classList.contains('active')).dataset.id;
            Account.remove(activeAccountId, (err, response) => {
                if (response.success === true) {
                    this.clear();
                    App.updateWidgets();
                }
            });
        } else {
            return;
        }
    }

    /**
     * Удаляет транзакцию (доход или расход). Требует
     * подтверждеия действия (с помощью confirm()).
     * По удалению транзакции вызовите метод App.update()
     * */
    removeTransaction(id) {
        const agree = confirm('Вы действительно хотите удалить транзакцию?');
        if (agree) {
            Transaction.remove(id, (err, response) => {
                if (response.success === true) {
                    App.updateWidgets();
                }
            });
        } else {
            return;
        }
    }

    /**
     * С помощью Account.get() получает название счёта и отображает
     * его через TransactionsPage.renderTitle.
     * Получает список Transaction.list и полученные данные передаёт
     * в TransactionsPage.renderTransactions()
     * */
    render(options) {
        if (!options) {
            return;
        }
        this.lastOptions = options;
        Account.get(options.account_id, (err, response) => {
            if (response.success === true) {
                this.renderTitle(response.data[options.account_id - 1].name);
            }
        });
        Transaction.list(options, (err, response) => {
            if (response.success === true) {
                this.renderTransactions(response.data);
            }
        });
    }

    /**
     * Очищает страницу. Вызывает
     * TransactionsPage.renderTransactions() с пустым массивом.
     * Устанавливает заголовок: «Название счёта»
     * */
    clear() {
        this.renderTransactions([]);
        this.renderTitle('Название счёта');
        this.lastOptions = '';
    }

    /**
     * Устанавливает заголовок в элемент .content-title
     * */
    renderTitle(name) {
        this.element.querySelector('.content-title').textContent = name;
    }

    /**
     * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
     * в формат «10 марта 2019 г. в 03:20»
     * */
    formatDate(date) {
        let dateString = new Date(date);
        let options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        return dateString.toLocaleString('ru', options);
    }

    /**
     * Формирует HTML-код транзакции (дохода или расхода).
     * item - объект с информацией о транзакции
     * */
    getTransactionHTML(item) {
        return `<div class="transaction transaction_${item.type} row">
            <div class="col-md-7 transaction__details">
              <div class="transaction__icon">
                  <span class="fa fa-money fa-2x"></span>
              </div>
              <div class="transaction__info">
                  <h4 class="transaction__title">${item.name}</h4>
                  <!-- дата -->
                  <div class="transaction__date">${this.formatDate(item.created_at)}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="transaction__summ">
              <!--  сумма -->
                  ${item.sum} <span class="currency">₽</span>
              </div>
            </div>
            <div class="col-md-2 transaction__controls">
                <!-- в data-id нужно поместить id -->
                <button class="btn btn-danger transaction__remove" data-id=${item.id}>
                    <i class="fa fa-trash"></i>  
                </button>
            </div>
            </div>`
    }

    /**
     * Отрисовывает список транзакций на странице
     * используя getTransactionHTML
     * */
    renderTransactions(data) {
        this.element.querySelector('.content').innerHTML = '';
        data.forEach(element => {
            this.element.querySelector('.content').insertAdjacentHTML("afterbegin", this.getTransactionHTML(element));
        });
    }
}