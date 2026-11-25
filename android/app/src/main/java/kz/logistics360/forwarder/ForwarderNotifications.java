package kz.logistics360.forwarder;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.google.firebase.messaging.RemoteMessage;
import java.util.Map;
import java.util.UUID;

final class ForwarderNotifications {
    static final String CHANNEL_ID = "forwarder_updates";
    private static final String PREFERENCES = "forwarder_push";

    static boolean setEnabled(Context context, boolean enabled) {
        boolean saved = context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)
            .edit().putBoolean("enabled", enabled).commit();
        if (saved && !enabled) NotificationManagerCompat.from(context).cancelAll();
        return saved;
    }

    static void createChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID,
                context.getString(R.string.push_channel_name), NotificationManager.IMPORTANCE_HIGH);
            context.getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }
    }

    static void show(Context context, RemoteMessage message) {
        // This preference survives process death and is cleared after logout/disable.
        if (!context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE).getBoolean("enabled", false)) return;
        if (!NotificationManagerCompat.from(context).areNotificationsEnabled()) return;
        Map<String, String> data = message.getData();
        String title = data.get("title");
        String body = data.get("body");
        if ((title == null || title.isEmpty()) && (body == null || body.isEmpty())) return;
        createChannel(context);
        String id = message.getMessageId();
        if (id == null || id.isEmpty()) id = data.get("type");
        if (id == null || id.isEmpty()) id = UUID.randomUUID().toString();
        Intent intent = new Intent(context, MainActivity.class)
            .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        for (Map.Entry<String, String> item : data.entrySet()) intent.putExtra(item.getKey(), item.getValue());
        intent.putExtra("google.message_id", id);
        PendingIntent tap = PendingIntent.getActivity(context, id.hashCode(), intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        NotificationCompat.Builder notification = new NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_notification)
            .setContentTitle(title == null || title.isEmpty() ? "360 Logistics" : title)
            .setContentText(body == null ? "" : body)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(body == null ? "" : body))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true).setContentIntent(tap);
        NotificationManagerCompat.from(context).notify(id, 0, notification.build());
    }
}
