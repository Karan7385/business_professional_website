import {
  createContext,
  useContext
} from "react";

const ContactModalContext = createContext({
  openContactModal: () => {},
  products: [],
});

export const useContactModal = () => useContext(ContactModalContext);

export default ContactModalContext;