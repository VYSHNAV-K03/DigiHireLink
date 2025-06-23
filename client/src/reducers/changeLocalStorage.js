const initialLocal_storage = "off";

const changeLocalStorage = (state = initialLocal_storage, action) => {
  switch (action.type) {
    case "clear":
      return (state = "clear");
    case "off":
      return (state = "off");
    default:
      return state;
  }
};

export default changeLocalStorage;
