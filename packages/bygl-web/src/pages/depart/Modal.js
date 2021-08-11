import {ModalForm,} from '@ant-design/pro-form';
import ObjectForm from './Form'

const Modal = (state) => {
  const {visible, type, record, title, onClose, ...restProps} = state;
  return (
    <ModalForm
      title={title}
      visible={visible}
      modalProps={{
        ...restProps,
        onCancel: onClose,
      }}
    >
      <ObjectForm {...state} />
    </ModalForm>
  );
};

export default Modal;
