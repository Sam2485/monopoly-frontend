import { useContext } from 'react';
import { GameContext } from './context/GameContext';
import Login from './components/Login';
import Home from './components/Home';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import WinnerScreen from './components/WinnerScreen';

function App() {
  const { currentScreen } = useContext(GameContext);

  switch (currentScreen) {
    case 'login':
      return <Login />;
    case 'home':
      return <Home />;
    case 'lobby':
      return <Lobby />;
    case 'game':
      return <GameBoard />;
    case 'winner':
      return <WinnerScreen />;
    default:
      return <Login />;
  }
}

export default App;
