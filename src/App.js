import { useEffect, useState } from "react";
import Login from "./components/Login";
import { auth } from "./services/firebase";
import ChatRoom from "./components/ChatRoom";
import Loading from "./components/Loading/Loading";

function App() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [initializing, setInitializing] = useState(true);


  // It is to determine that the is user already logged in or not if yes then set the user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {

      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      // it shows the loading till we fetch the user
      if (initializing) {
        setInitializing(false);
      }
    });

    // Clean up function
    return unsubscribe;
  }, [initializing]);

  // Return the Loading Component if initializing is true
  if (initializing) return <Loading />;

  return (
    <div className="min-h-screen min-w-screen bg-blue-100 dark:bg-gray-700 dark:text-white">
      {!user ? <Login /> : <ChatRoom user={user} />}
    </div>
  );
}

export default App;