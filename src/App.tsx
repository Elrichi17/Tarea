
import React, { useState, useEffect } from 'react';

interface Player {
  first_name: string;
  h_in: number;
  h_meters: number;
  last_name: string;
}

const App: React.FC = () => {
  const [inputHeight, setInputHeight] = useState<number | string>('');
  const [playersMap, setPlayersMap] = useState<Map<string, Player>>(new Map());
  const [pairs, setPairs] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('https://mach-eight.uc.r.appspot.com/');
        const data = await response.json();

        const playerMap = new Map<string, Player>();
        data.values.forEach((player: Player) => {
          playerMap.set(player.first_name+' '+player.last_name, player);
        });

        setPlayersMap(playerMap);
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };

    fetchPlayers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputHeight(e.target.value);
  };
const findPairs = () => {
  const heightPairs: string[] = [];
 for (const [nombre1, player1] of playersMap) {
   for (const [nombre2, player2] of playersMap) {
     if (nombre1 != nombre2 && Number(player1.h_in)+Number(player2.h_in)==inputHeight) {  
      const pareja=`${player1.first_name} ${player1.last_name} - ${player2.first_name} ${player2.last_name}`
      const parejaAlreves=`${player2.first_name} ${player2.last_name} - ${player1.first_name} ${player1.last_name}`
       if(!heightPairs.includes(pareja) && !heightPairs.includes(parejaAlreves)){
       heightPairs.push( pareja)
       }
       
     }
   }
 }
 setPairs(heightPairs.length ? heightPairs : ['No matches found']);
};

  return (
    <div>
      <h1>NBA Player Height Pairs</h1>
      <input
        type="number"
        value={inputHeight}
        onChange={handleInputChange}
        placeholder="Enter target height in inches"
      />
      <button onClick={findPairs}>Find Pairs</button> 
      <div>
        {pairs.map((pair, index) => (
          <p key={index}>{pair}</p>
        ))}
      </div>
    </div>
  );
};

export default App;