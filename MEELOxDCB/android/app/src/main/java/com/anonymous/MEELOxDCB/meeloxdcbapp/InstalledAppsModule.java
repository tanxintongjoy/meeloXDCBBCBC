package com.anonymous.MEELOxDCB.meeloxdcbapp;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.util.List;

public class InstalledAppsModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;

    public InstalledAppsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "InstalledApps";
    }

    @ReactMethod
    public void getInstalledApps(Promise promise) {
        try {
            PackageManager pm = reactContext.getPackageManager();
            List<PackageInfo> packages = pm.getInstalledPackages(0);
            WritableArray appsArray = Arguments.createArray();

            for (PackageInfo packageInfo : packages) {
                // Filter out system apps if you want only user-installed apps
                if ((packageInfo.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) == 0) {
                    WritableMap app = Arguments.createMap();
                    app.putString("appName", packageInfo.applicationInfo.loadLabel(pm).toString());
                    app.putString("packageName", packageInfo.packageName);
                    appsArray.pushMap(app);
                }
            }

            promise.resolve(appsArray);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
}
