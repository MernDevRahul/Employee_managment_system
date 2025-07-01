import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationRead,
} from "../store/notificationSlice";
import { Bell } from "lucide-react"; // Optional icon

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { list: notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg z-50 p-4">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications yet</p>
          ) : (
            <ul className="max-h-64 overflow-y-auto space-y-3">
              {notifications.map((note) => (
                <li
                  key={note.id}
                  onClick={() => dispatch(markNotificationRead(note.id))}
                  className={`border-b pb-2 text-sm cursor-pointer ${
                    !note.is_read ? 'bg-yellow-50 hover:bg-yellow-100':""
                  }`}
                >
                  <p>{note.message}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(note.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
