import { useAppDispatch, useAppSelector } from "redux/hooks";
// import { messageActions } from "redux/slices/message";
import SocketService from "../../../services/sockets.service";
import ChatBoxForm from "./ChatBoxForm";
import io from "socket.io-client";
import { config } from "../../../config/config";
export default function ChatBox({ type }: any) {
  const socket = SocketService.socket;
  console.log(config.PUBLIC_CHAT_ROOM, "TI[S");
  // const user = useAppSelector((state) => state.auth.user);
  // const chat = useAppSelector((state) => state.chat.chats);
  // const guest = useAppSelector((state) => state.user.user);
  // const socket = io('http://localhost:3001/');
  // console.log(socket)

  const handleSubmit = (values: any) => {
    // values.user = user ? user.username : guest?.name;
    if(values.message){
      console.log(values, "me");
      socket.emit(config.PUBLIC_CHAT_ROOM, { message: values.message });
    }
   
    // values.id = localStorage.getItem("socketId");
    // SocketService.send(values);
  };

  return <ChatBoxForm onSubmit={handleSubmit} />;
}
