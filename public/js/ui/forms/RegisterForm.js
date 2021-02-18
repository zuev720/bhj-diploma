/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */

  onSubmit(data) {
    User.register( data, (err, response) => {
      console.log(response)
      if (response.success === true) {
        const activeForm = new Modal(this.element.closest('.modal'));
        activeForm.close();
        this.element.reset();
        App.setState('user-logged');
      }
    });
  }
}