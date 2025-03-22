import UpArrowSVG from "../assets/UpArrowSVG";

// the chat ui should only show the two most recent messages at any time. as new messages are sent, older ones should be removed from view. This keeps the conversation focused and prevents unnecessary scrolling. user responses should be shown in a grey-filled chat bubble and AI responses should be in non-coloured chat bubble

// prompts entered in the chat box form will be "pushed" and shown here after they are submitted?
// const UserResponse = (prompts) => {
//   return (
//     <>
//       <div>{prompts}</div>
//     </>
//   );
// };

const ChatBox = () => {
  return (
    <>
      <div className="absolute bottom-32 flex w-1/2 justify-between items-center border-solid border-1 border-gray-300 shadow-sm rounded-3xl p-8 gap-4 ">
        <form action="" className="flex w-full">
          <div className="flex w-full">
            <label htmlFor="prompt"></label>
            <textarea
              className="flex h-8 w-full resize-none border-0 bg-transparent px-0 py-2 focus:outline-none focus:ring-0"
              placeholder="Ask anything"
              id="prompt"
              name="prompt"
            ></textarea>
          </div>
        </form>
        <div>
          <button type="submit" className="bg-zinc-950 border rounded-full">
            <UpArrowSVG />
          </button>
        </div>
      </div>
    </>
  );
};

const AIResponse = () => {
  return (
    <>
      <section className="flex flex-col items-center">
        <h1>
          Welcome,
          <span className="italic"> User.</span>
        </h1>
        <p className="text-gray-500">What are we building today</p>
      </section>
    </>
  );
};

// when a user tries to enter a prompt before logging in, the prompt should be saved but the user should be asked to log in in order to continue

const Home = () => {
  return (
    <main className="relative flex w-dvw h-dvh items-center justify-center">
      <AIResponse />
      <ChatBox />
    </main>
  );
};

export default Home;
