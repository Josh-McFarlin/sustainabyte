import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import firebase from "firebase";
import AuthedNavigator from "./src/navigation/authed";
import UnauthedNavigator from "./src/navigation/unauthed";
import { AuthContext } from "./src/utils/auth";
import { observeAuthState } from "./src/utils/firebase/actions/auth";
import SplashScreen from "./src/components/SplashScreen";

type User = firebase.User;

const App: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoading(false);

    observeAuthState((u) => {
      setUser(u);
    });
  }, []);

  const isLoggedIn = user != null;

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        isLoggedIn,
      }}
    >
      {loading ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          {isLoggedIn ? <AuthedNavigator /> : <UnauthedNavigator />}
        </NavigationContainer>
      )}
    </AuthContext.Provider>
  );
};

export default App;
