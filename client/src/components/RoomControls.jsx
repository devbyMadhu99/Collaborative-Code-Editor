
import "../App.css";

function RoomControls({
  roomId,
  setRoomId,
  joinedRoom,
  joinRoom,
}) {
  return (
    <div className="room-controls">
      <input
        value={roomId}
        onChange={(e) => {
          setRoomId(e.target.value);
        }}
        placeholder="Enter room ID"
      />

      <button onClick={joinRoom} disabled={joinedRoom}>
        {joinedRoom ? `Joined: ${roomId}` : "Join Room"}
      </button>
    </div>
  );
}

export default RoomControls;
