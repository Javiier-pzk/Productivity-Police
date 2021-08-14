import firebase from "./firebase";
import * as Notifications from "expo-notifications";
import moment from "moment";

const db = firebase.database();

const newHabit = (
  id,
  Subject,
  Repetitions,
  Type,
  Category,
  ReceiveNotif,
  DateTimeFormatted,
  Reminder,
  completed,
  currentProgress,
  tapCount,
  streak,
  completedBefore,
  nextUpdate,
  Identifier
) => ({
  id,
  Subject,
  Repetitions,
  Type,
  Category,
  ReceiveNotif,
  DateTimeFormatted,
  Reminder,
  completed,
  currentProgress,
  tapCount,
  streak,
  completedBefore,
  nextUpdate,
  Identifier,
});

export const createHabit = async (
  {
    userId,
    Subject,
    Repetitions,
    Type,
    Category,
    ReceiveNotif,
    DateTimeFormatted,
    Reminder,
    Identifier,
  },
  onSuccess,
  onError
) => {
  try {
    const habit = db.ref(`habits/${userId}`).push();
    await habit.set(
      newHabit(
        habit.key,
        Subject,
        Repetitions,
        Type,
        Category,
        ReceiveNotif,
        DateTimeFormatted,
        Reminder,
        false,
        0,
        0,
        0,
        false,
        moment().endOf(Category.toLowerCase()).format("MMMM Do YYYY, h:mm a"),
        Identifier
      )
    );
    return onSuccess(habit);
  } catch (error) {
    return onError(error);
  }
};

export const editHabit = async (
  Subject,
  Repetitions,
  Type,
  Category,
  ReceiveNotif,
  DateTimeFormatted,
  Reminder,
  Identifier,
  { userId, habitId },
  onSuccess,
  onError
) => {
  try {
    const habit = db.ref(`habits/${userId}/${habitId}`);
    await habit.update({
      Subject,
      Repetitions,
      Type,
      Category,
      ReceiveNotif,
      DateTimeFormatted,
      Reminder,
      Identifier,
    });
    return onSuccess(habit);
  } catch (error) {
    onError(error);
  }
};

export const setHabitCompletion = async (
  completed,
  { userId, habitId },
  onSuccess,
  onError
) => {
  try {
    const habit = db.ref(`habits/${userId}/${habitId}`);
    await habit.update({ completed });
    return onSuccess(habit);
  } catch (error) {
    return onError(error);
  }
};

export const setNextUpdate = async (
  nextUpdate,
  { userId, habitId },
  onSuccess,
  onError
) => {
  try {
    const habit = db.ref(`habits/${userId}/${habitId}`);
    await habit.update({ nextUpdate });
    return onSuccess(habit);
  } catch (error) {
    return onError(error);
  }
};

export const updateStreakCount = async (
  streak,
  completedBefore,
  { userId, habitId },
  onSuccess,
  onError
) => {
  try {
    const habit = db.ref(`habits/${userId}/${habitId}`);
    await habit.update({ streak, completedBefore });
    return onSuccess(habit);
  } catch (error) {
    return onError(error);
  }
};

export const updateCurrentProgress = async (
  currentProgress,
  tapCount,
  { userId, habitId },
  onSuccess,
  onError
) => {
  try {
    const habit = db.ref(`habits/${userId}/${habitId}`);
    await habit.update({ currentProgress, tapCount });
    return onSuccess(habit);
  } catch (error) {
    return onError(error);
  }
};

export const updateCurrentProgressManual = async (
  increment,
  { userId, habitId },
  onSuccess,
  onError
) => {
  try {
    const habit = db.ref(`habits/${userId}/${habitId}`);
    const item = await habit.get().then((snapshot) => snapshot.val());
    const maxIncrement = parseInt(item.Repetitions) - item.tapCount;
    if (increment > maxIncrement) {
      const currentProgress =
        item.currentProgress + (maxIncrement / item.Repetitions) * 100;
      const tapCount = item.tapCount + maxIncrement;
      await habit.update({ currentProgress, tapCount });
    } else {
      const currentProgress =
        item.currentProgress + (increment / item.Repetitions) * 100;
      const tapCount = item.tapCount + increment;
      await habit.update({ currentProgress, tapCount });
    }
    return onSuccess(habit);
  } catch (error) {
    return onError(error);
  }
};

export const rescheduleNotifWhenUncomplete = async (
  { userId, habitId },
  onSuccess,
  onError
) => {
  try {
    const habit = db.ref(`habits/${userId}/${habitId}`);
    const item = await habit.get().then((snapshot) => snapshot.val());
    if (item.ReceiveNotif) {
      await Notifications.cancelScheduledNotificationAsync(item.Identifier);
      const Identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title:
            item.Category === "Day"
              ? "Daily Habit Reminder"
              : `${item.Category}ly Habit Reminder`,
          body: item.Subject,
          data: {},
          sound: true,
        },
        trigger: {
          hour: parseInt(item.Reminder.substring(0, 2)),
          minute: parseInt(item.Reminder.substring(3)),
          repeats: true,
        },
      });
      await habit.update({ Identifier });
    }
    return onSuccess(habit);
  } catch (error) {
    return onError(error);
  }
};

export const completeHabit = ({ userId, habitId }, onSuccess, onError) => {
  return setHabitCompletion(true, { userId, habitId }, onSuccess, onError);
};

export const uncompleteHabit = ({ userId, habitId }, onSuccess, onError) => {
  return setHabitCompletion(false, { userId, habitId }, onSuccess, onError);
};

export const deleteHabit = async ({ userId, habitId }, onSuccess, onError) => {
  try {
    await db.ref(`habits/${userId}/${habitId}`).remove();
    return onSuccess();
  } catch (error) {
    return onError(error);
  }
};

export const habitsSubscribe = (userId, onValueChanged) => {
  const habits = db.ref(`habits/${userId}`);
  habits.on("value", (snapshot) => onValueChanged(snapshot.val()));
  return () => habits.off("value");
};
