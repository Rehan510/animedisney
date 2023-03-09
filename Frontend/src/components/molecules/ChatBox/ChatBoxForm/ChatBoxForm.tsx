import { Field, reduxForm,reset } from "redux-form";
import{useDispatch} from 'react-redux'
function ChatBoxForm({ handleSubmit }: any) {
  return (
    <form
      onSubmit={handleSubmit}
      className="form"
      style={{ alignItems: "stretch" }}
    >
      <Field
        type="text"
        name="message"
        placeholder="Message"
        component="textarea"
        rows={6}
        style={{
          width: "100%",
          margin: "0",
          background: "none",
          border: "2px solid #ffffff",
        }}
       
        onKeyDown={(e: any) => {
          if (e.keyCode === 13 && !e.shiftKey) {
            handleSubmit();
          }
        }}
      />
      <br />
      <button
        type="submit"
        style={{
          color: "white",
          padding: "18px 24px",
          background: "none",
          border: "2px solid #ffffff",
          cursor:'pointer'
        }}
      >
        Send
      </button>
    </form>
  );
}

export default reduxForm({ form: "ChatBoxForm" })(ChatBoxForm);
