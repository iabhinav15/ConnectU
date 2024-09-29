export const getAllNotification = async (req, res) => {
  res.send("Notification Route");
};

export const sendNotification = async (req, res) => {
  res.send("Notification Route");
};

export const countNotification = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const count = await Notification.find({ userId: userId, read: false }).countDocuments();

    res.status(200).json({
      success: true,
      message: "Notification count fetched successfully",
      data: count
    });

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const readNotification = async (req, res) => {
  res.send("Notification Route");
};

export const readAllNotification = async (req, res) => {
  res.send("Notification Route");
};

