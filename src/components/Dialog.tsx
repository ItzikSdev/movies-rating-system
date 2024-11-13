import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import MyLineChart from "./MyLineChart";
import { TRows } from "../types";
 
interface IDialogDefault {
  open: boolean;
  handleOpen: () => void;
  movie: TRows | undefined
}

const DialogDefault = ({ open, handleOpen, movie }: IDialogDefault) => {
 
  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Votes for - {movie?.description}</DialogHeader>
        <DialogBody>
         <MyLineChart movie={movie}/>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-1">Close</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default DialogDefault