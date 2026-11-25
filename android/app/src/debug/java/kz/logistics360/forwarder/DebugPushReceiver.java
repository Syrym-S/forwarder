package kz.logistics360.forwarder;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.google.firebase.messaging.RemoteMessage;

/** Local display check for Android Studio, without pretending to be an FCM delivery. */
public class DebugPushReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        RemoteMessage message = new RemoteMessage.Builder("local-debug-check")
            .setMessageId("forwarder-local-display-check")
            .addData("title", "Forwarder: проверка уведомлений")
            .addData("body", "Локальный тест Android. Приложение закрыто; это не доставка через Firebase.")
            .addData("link", "/forwarder/settings")
            .addData("type", "debug.local_notification").build();
        ForwarderNotifications.show(context, message);
    }
}
