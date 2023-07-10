import React from "react";
import { Divider, Modal } from "native-base";

export default function Popup({ open, setOpen, header, children }) {
  return (
    <Modal isOpen={open} onClose={() => setOpen(!open)} size={"lg"}>
      <Modal.Content>
        <Modal.CloseButton/>
        <Modal.Header>{header}</Modal.Header>
        <Modal.Body>
          {children}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}