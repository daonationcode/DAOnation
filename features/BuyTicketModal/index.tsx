import { Button, IconButton, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose } from '@heathmont/moon-icons-tw';

export default function BuyTicketModal({ open, onClose, eventName, ticketPrice }: { open: boolean; onClose: () => void; eventName: string; ticketPrice: number }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="min-w-[760px] bg-gohan">
        <div className="flex items-center justify-center flex-col">
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Buy ticket for {eventName}</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onClose} />
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full max-h-[calc(90vh-162px)] p-6">This is a stub</div>
        <div className="flex justify-between border-t border-beerus w-full p-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button>Buy ticket</Button>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
