let globalSetShowModal = null;
let globalSetTitle = null;
let globalSetContent = null;
let globalSetCloseText = null;
let globalSetAllowText = null;
let isActive = false;
let onCloseCallback = null;
let onAllowCallback = null;

function setGlobalModalFunctions(
  setShowModal,
  setTitle,
  setContent,
  setCloseText,
  setAllowText,
) {
  globalSetShowModal = setShowModal;
  globalSetTitle = setTitle;
  globalSetContent = setContent;
  globalSetCloseText = setCloseText;
  globalSetAllowText = setAllowText;
}

function hideModal(allow = false) {
  if (globalSetShowModal) {
    globalSetShowModal(false);
    isActive = false;
    if (!allow && onCloseCallback) {
      onCloseCallback();
      onCloseCallback = null;
    }
    if (allow && onAllowCallback) {
      onAllowCallback();
      onAllowCallback = null;
    }
  }
}

function hideModalWithoutCallback() {
  if (globalSetShowModal) {
    globalSetShowModal(false);
    isActive = false;
    onCloseCallback = null;
    onAllowCallback = null;
  }
}

function showModal(
  title,
  content,
  closeText,
  allowText = null,
  onAllow = () => {},
  onClose = () => {},
) {
  if (isActive) {
    return;
  }
  if (globalSetShowModal) {
    globalSetShowModal(true);
    isActive = true;
  }
  if (globalSetTitle) {
    globalSetTitle(title);
  }
  if (globalSetContent) {
    globalSetContent(content);
  }
  if (globalSetCloseText) {
    globalSetCloseText(closeText);
  }
  if (globalSetAllowText) {
    globalSetAllowText(allowText);
  }
  onCloseCallback = onClose;
  onAllowCallback = onAllow;
}

export {
  setGlobalModalFunctions,
  showModal,
  hideModal,
  hideModalWithoutCallback,
};
