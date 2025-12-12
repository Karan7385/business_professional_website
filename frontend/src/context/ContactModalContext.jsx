import { createContext, useContext } from "react";

const ContactModalContext = createContext({
  openContactModal: () => {},
});

export const useContactModal = () => useContext(ContactModalContext);

export default ContactModalContext;