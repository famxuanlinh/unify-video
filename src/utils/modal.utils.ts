type ModalStateType = {
  onOpen: (...args: any) => any;
  onClose: (...args: any) => any;
};

type ModalStateDType<T> = {
  onOpen: (data: T) => any;
  onClose: () => any;
};

export type ConfirmModalDataType = {
  title: string | React.ReactNode;
  desc: string | React.ReactNode;
  isSubmitForcedOpen?: boolean;
  cancelText?: string;
  cancelClassName?: string;
  submitClassName?: string;
  submitText?: string;
  isForceOpen?: boolean;
  submitVariant?: 'primary' | 'secondary' | 'red';
  onSubmit?: () => void;
  onCloseCallback?: () => void;
};

export interface ReportModalProps {
  type: 'account' | 'post';
  postLink?: string;
  accountLink?: string;
  reporterLink?: string;
}

export const ModalUtils: {
  sayModal: ModalStateType & { closeOnQuotePost: (...args: any) => any };
  connectWallet: ModalStateType;
  placeChest: ModalStateType;
  selectGifModal: ModalStateType;
  reportModal: ModalStateDType<ReportModalProps>;
  blockModal: ModalStateType;
  alertModal: ModalStateType;
  viewAllAccount: ModalStateType;
  homeMenu: ModalStateType;
  postOption: ModalStateType;
  confirm: ModalStateDType<ConfirmModalDataType>;
  imageViewer: ModalStateType;
  kycWelcome: ModalStateType;
  kycConfirm: ModalStateType;
} = Object.freeze({
  sayModal: {
    onOpen: () => {},
    onClose: () => {},
    closeOnQuotePost: () => {}
  },
  connectWallet: {
    onOpen: () => {},
    onClose: () => {}
  },
  placeChest: {
    onOpen: () => {},
    onClose: () => {}
  },
  selectGifModal: {
    onOpen: () => {},
    onClose: () => {}
  },
  reportModal: {
    onOpen: () => {},
    onClose: () => {}
  },
  blockModal: {
    onOpen: () => {},
    onClose: () => {}
  },
  alertModal: {
    onOpen: () => {},
    onClose: () => {}
  },
  viewAllAccount: {
    onOpen: () => {},
    onClose: () => {}
  },
  homeMenu: {
    onOpen: () => {},
    onClose: () => {}
  },
  postOption: {
    onOpen: () => {},
    onClose: () => {}
  },
  confirm: {
    onOpen: () => {},
    onClose: () => {}
  },
  imageViewer: {
    onOpen: () => {},
    onClose: () => {}
  },
  kycWelcome: {
    onOpen: () => {},
    onClose: () => {}
  },
  kycConfirm: {
    onOpen: () => {},
    onClose: () => {}
  }
});
