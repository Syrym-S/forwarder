package kz.logistics360.forwarder;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.firebase.FirebaseApp;

@CapacitorPlugin(name = "ForwarderPush")
public class ForwarderPushPlugin extends Plugin {
    @PluginMethod
    public void getStatus(PluginCall call) {
        JSObject result = new JSObject();
        result.put("configured", !FirebaseApp.getApps(getContext()).isEmpty());
        call.resolve(result);
    }

    @PluginMethod
    public void setDeliveryEnabled(PluginCall call) {
        boolean enabled = Boolean.TRUE.equals(call.getBoolean("enabled", false));
        if (!ForwarderNotifications.setEnabled(getContext(), enabled)) {
            call.reject("web_push_token_failed");
            return;
        }
        call.resolve();
    }
}
