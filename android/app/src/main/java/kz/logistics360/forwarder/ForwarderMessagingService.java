package kz.logistics360.forwarder;

import androidx.annotation.NonNull;
import com.capacitorjs.plugins.pushnotifications.MessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class ForwarderMessagingService extends MessagingService {
    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);
        // FCM displays notification payloads itself in the background. Data-only
        // messages need a native notification even when no Capacitor bridge exists.
        if (message.getNotification() == null && !MainActivity.isVisible) {
            ForwarderNotifications.show(this, message);
        }
    }
}
