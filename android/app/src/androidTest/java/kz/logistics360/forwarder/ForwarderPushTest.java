package kz.logistics360.forwarder;

import static org.junit.Assert.*;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.os.ParcelFileDescriptor;
import android.service.notification.StatusBarNotification;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import com.capacitorjs.plugins.pushnotifications.PushNotificationsPlugin;
import com.google.firebase.messaging.RemoteMessage;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class ForwarderPushTest {
    private Context context;
    private NotificationManager notifications;

    private static class TestService extends ForwarderMessagingService {
        TestService(Context context) { attachBaseContext(context); }
    }

    @Before
    public void setup() throws Exception {
        context = InstrumentationRegistry.getInstrumentation().getTargetContext();
        notifications = context.getSystemService(NotificationManager.class);
        if (Build.VERSION.SDK_INT >= 33) {
            try (ParcelFileDescriptor result = InstrumentationRegistry.getInstrumentation().getUiAutomation()
                .executeShellCommand("pm grant " + context.getPackageName() + " android.permission.POST_NOTIFICATIONS");
                java.io.InputStream input = new ParcelFileDescriptor.AutoCloseInputStream(result)) {
                while (input.read() != -1) { }
            }
        }
        notifications.cancelAll();
        MainActivity.isVisible = false;
        PushNotificationsPlugin.staticBridge = null;
        ForwarderNotifications.setEnabled(context, true);
    }

    @After
    public void cleanup() {
        ForwarderNotifications.setEnabled(context, false);
        PushNotificationsPlugin.lastMessage = null;
        MainActivity.isVisible = false;
    }

    private RemoteMessage message(String id) {
        return new RemoteMessage.Builder("test-sender").setMessageId(id)
            .addData("title", "Forwarder background test")
            .addData("body", "Data-only notification without an Activity or WebView")
            .addData("link", "/forwarder/leads/test-123")
            .addData("type", "shipping.loading_started.test-123").build();
    }

    @Test
    public void dataOnlyMessageShowsWithoutActivityOrWebView() throws Exception {
        assertNull(PushNotificationsPlugin.staticBridge);
        new TestService(context).onMessageReceived(message("background-test"));
        StatusBarNotification[] shown = notifications.getActiveNotifications();
        assertEquals(1, shown.length);
        Notification notification = shown[0].getNotification();
        assertEquals("Forwarder background test", notification.extras.getString(Notification.EXTRA_TITLE));
        assertEquals(ForwarderNotifications.CHANNEL_ID, notification.getChannelId());
        assertNotNull(notification.contentIntent);
        // Same FCM message must replace the existing notification.
        new TestService(context).onMessageReceived(message("background-test"));
        assertEquals(1, notifications.getActiveNotifications().length);
    }

    @Test
    public void disabledOrLoggedOutDeviceDoesNotShowNotifications() {
        ForwarderNotifications.setEnabled(context, false);
        new TestService(context).onMessageReceived(message("disabled-test"));
        assertEquals(0, notifications.getActiveNotifications().length);
    }

    @Test
    public void foregroundUsesExistingSocketInsteadOfAnotherSystemPopup() {
        MainActivity.isVisible = true;
        new TestService(context).onMessageReceived(message("foreground-test"));
        assertEquals(0, notifications.getActiveNotifications().length);
    }
}
