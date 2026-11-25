package kz.logistics360.forwarder;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    static volatile boolean isVisible;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ForwarderPushPlugin.class);
        super.onCreate(savedInstanceState);
        if ((getApplicationInfo().flags & android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
            android.webkit.WebView.setWebContentsDebuggingEnabled(true);
        }
        ForwarderNotifications.createChannel(this);
    }

    @Override
    public void onResume() {
        super.onResume();
        isVisible = true;
    }

    @Override
    public void onPause() {
        isVisible = false;
        super.onPause();
    }
}
