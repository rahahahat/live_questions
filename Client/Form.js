import React from "react";
const Form = ({ obj, handleOnChange, handleSubmit }) => {
  return (
    <div className={`form-area`}>
      <div className={`textbox-shell`}>
        <textarea
          name="texts"
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
