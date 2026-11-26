import { authenticateSocket } from "../../../middleware/auth.js";

export const registerChatSocket = (io) => {
  const activeUsers = new Map();
  const isValidUserId = (id) =>
    typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

  const broadcastActiveUsers = () => {
    io.emit("active users", Array.from(activeUsers.values()));
  };

  const acknowledge = (callback, response) => {
    if (typeof callback === "function") {
      callback(response);
    }
  };

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const { id, userName } = socket.data.user;
    const userId = String(id);

    const currentUser = activeUsers.get(userId);
    activeUsers.set(userId, {
      id: userId,
      userName,
      connections: (currentUser?.connections || 0) + 1,
    });
    socket.join(`user:${userId}`);

    broadcastActiveUsers();

    socket.on("chat message", (message) => {
      if (typeof message !== "string" || !message.trim()) {
        return;
      }

      io.emit("chat message", {
        userName,
        message: message.trim(),
      });
    });

    socket.on("private message", (payload, callback) => {
      const recipientId = payload?.recipientId;
      const text =
        typeof payload?.message === "string" ? payload.message.trim() : "";

      if (!isValidUserId(recipientId) || recipientId === userId) {
        return acknowledge(callback, { error: "Select a valid recipient" });
      }
      if (!activeUsers.has(recipientId)) {
        return acknowledge(callback, { error: "Recipient is not online" });
      }
      if (!text || text.length > 2000) {
        return acknowledge(callback, {
          error: "Message must be between 1 and 2000 characters",
        });
      }

      const privateMessage = {
        senderId: userId,
        senderName: userName,
        recipientId,
        message: text,
      };

      io.to(`user:${recipientId}`).emit("private message", privateMessage);
      acknowledge(callback, { message: privateMessage });
    });

    socket.on("disconnect", () => {
      const currentUser = activeUsers.get(userId);
      if (currentUser?.connections > 1) {
        activeUsers.set(userId, {
          ...currentUser,
          connections: currentUser.connections - 1,
        });
      } else {
        activeUsers.delete(userId);
      }
      broadcastActiveUsers();
    });
  });
};