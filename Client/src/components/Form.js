import React from "react";
const Form = ({ obj, handleOnChange, handleSubmit, socket }) => {
  return (
    <div className={`form-area`}>
      <div className={`textbox-shell`}>
        <textarea
          name="text"
          type="text"
          className={`text-area`}
          onChange={handleOnChange}
          value={obj.texts}
          rows="1"
          cols="80"
          placeholder="Ask a question..."
        />
      </div>
      <div className={`btn`} onClick={handleSubmit}>
        Submit
      </div>
    </div>
  );
};

export default Form;
