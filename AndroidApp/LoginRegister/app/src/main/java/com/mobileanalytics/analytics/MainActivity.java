package com.mobileanalytics.analytics;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.content.Context;
import android.content.res.Configuration;
import android.graphics.Point;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.app.AppCompatActivity;
import android.telephony.TelephonyManager;
import android.util.Patterns;
import android.view.Display;
import android.view.View;
import android.widget.Button;

import java.lang.reflect.Method;
import java.util.Calendar;
import java.util.regex.Pattern;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    Button bBegin,bEvent,bCrash,bEnd;
    Boolean vDeviceType;
    String[] deviceMetrics = null;
    String vSessionID,vEmailID,vUserID,vAppKey="109158001";
    Long vAppStart,vAppEnd;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        bBegin = (Button) findViewById(R.id.bBegin);
        bEvent = (Button) findViewById(R.id.bEvent);
        bCrash = (Button) findViewById(R.id.bCrash);
        bEnd = (Button) findViewById(R.id.bEnd);

        bBegin.setOnClickListener(this);
        bEvent.setOnClickListener(this);
        bCrash.setOnClickListener(this);
        bEnd.setOnClickListener(this);

        bEvent.setEnabled(false);
        bCrash.setEnabled(false);
        bEnd.setEnabled(false);
    }

    private String getResolution(){
        Display display =    getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        int width = size.x;
        int height = size.y;

        return height+"*"+width;
    }

    private String getCarrier(){
        TelephonyManager manager = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
        String carrierName = manager.getNetworkOperatorName();
        return carrierName;
    }

    private String getDeviceID(){
        return Settings.Secure.getString(this.getContentResolver(), Settings.Secure.ANDROID_ID);
    }

    private String getEmailID(){
        Pattern emailPattern = Patterns.EMAIL_ADDRESS;
        Account[] accounts = AccountManager.get(getBaseContext()).getAccounts();
        for (Account account : accounts)
        {
            if (emailPattern.matcher(account.name).matches() && account.type.equals("com.google"))
            {
                vEmailID = account.name;
            }
        }
        if (vEmailID!= null){
            return vEmailID;
        }else{
            vEmailID = "jainsourabh2@gmail.com";
        }

            return vEmailID;
    }

    private Double[] getLocation(){
        Double[] vLocation = null;
        vLocation = new Double[2];
        Boolean vGPSEnabled = false;
        LocationManager lm = (LocationManager)getSystemService(Context.LOCATION_SERVICE);
        try {
            try{
                vGPSEnabled = lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
            } catch(Exception ex) {}
            if (!vGPSEnabled){
                vLocation[0] = 0.0;
                vLocation[1] = 0.0;
                return vLocation;
            }else {
                Location location = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                vLocation[0] = location.getLongitude();
                vLocation[1] = location.getLatitude();
            }
        }catch(SecurityException s){
            s.printStackTrace();
        }

        return vLocation;
    }

    private boolean getTabletDevice() {
        if (android.os.Build.VERSION.SDK_INT >= 11) { // honeycomb
            // test screen size, use reflection because isLayoutSizeAtLeast is only available since 11
            Configuration con = getResources().getConfiguration();
            try {
                Method mIsLayoutSizeAtLeast = con.getClass().getMethod("isLayoutSizeAtLeast");
                Boolean r = (Boolean) mIsLayoutSizeAtLeast.invoke(con, 0x00000004); // Configuration.SCREENLAYOUT_SIZE_XLARGE
                return r;
            } catch (Exception x) {
                return false;
            }
        }
        return false;
    }

    private String getOrientation(){
        int vOrientation = getResources().getConfiguration().orientation;
        if (vOrientation==1){
            return "PORTRAIT";
        }else{
            return "LANDSCAPE";
        }
    }

    private String getNetworkClass(Context context) {
        TelephonyManager mTelephonyManager = (TelephonyManager)
                context.getSystemService(Context.TELEPHONY_SERVICE);
        int networkType = mTelephonyManager.getNetworkType();
        switch (networkType) {
            case TelephonyManager.NETWORK_TYPE_GPRS:
            case TelephonyManager.NETWORK_TYPE_EDGE:
            case TelephonyManager.NETWORK_TYPE_CDMA:
            case TelephonyManager.NETWORK_TYPE_1xRTT:
            case TelephonyManager.NETWORK_TYPE_IDEN:
                return "2G";
            case TelephonyManager.NETWORK_TYPE_UMTS:
            case TelephonyManager.NETWORK_TYPE_EVDO_0:
            case TelephonyManager.NETWORK_TYPE_EVDO_A:
            case TelephonyManager.NETWORK_TYPE_HSDPA:
            case TelephonyManager.NETWORK_TYPE_HSUPA:
            case TelephonyManager.NETWORK_TYPE_HSPA:
            case TelephonyManager.NETWORK_TYPE_EVDO_B:
            case TelephonyManager.NETWORK_TYPE_EHRPD:
            case TelephonyManager.NETWORK_TYPE_HSPAP:
                return "3G";
            case TelephonyManager.NETWORK_TYPE_LTE:
                return "4G";
            default:
                return "Unknown";
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.bBegin:
                try{
                    vAppStart = Calendar.getInstance().getTimeInMillis();
                    vDeviceType = getTabletDevice();
                    vUserID = getEmailID();
                    vSessionID = Long.toString(System.currentTimeMillis());
                    vSessionID = vSessionID.concat(vUserID);
                    Double[] Location = getLocation();
                    deviceMetrics = new String[11];
                    deviceMetrics[0] = vDeviceType.toString();
                    deviceMetrics[1] = vSessionID;
                    deviceMetrics[2] = getResolution();
                    deviceMetrics[3] = getCarrier();
                    deviceMetrics[4] = getNetworkClass(this);
                    deviceMetrics[5] = getDeviceID();
                    deviceMetrics[6] = vUserID;
                    deviceMetrics[7] = String.valueOf(Location[0]);
                    deviceMetrics[8] = String.valueOf(Location[1]);
                    deviceMetrics[9] = getOrientation();
                    deviceMetrics[10] = vAppKey;
                    System.out.println();
                    new PostBeginData().execute(deviceMetrics);
                    bBegin.setEnabled(false);
                    bEvent.setEnabled(true);
                    bCrash.setEnabled(true);
                    bEnd.setEnabled(true);
                }catch(Exception ex){
                    ex.printStackTrace();
                }
                break;
            case R.id.bEvent:
                break;
            case R.id.bCrash:
                try{
                    //vDeviceType = getTabletDevice();
                    //vUserID = getEmailID();
                    //vSessionID = Long.toString(System.currentTimeMillis());
                    //vSessionID = vSessionID.concat(vUserID);
                    Double[] Location = getLocation();
                    deviceMetrics = new String[11];
                    deviceMetrics[0] = vDeviceType.toString();
                    deviceMetrics[1] = vSessionID;
                    deviceMetrics[2] = getResolution();
                    deviceMetrics[3] = getCarrier();
                    deviceMetrics[4] = getNetworkClass(this);
                    deviceMetrics[5] = getDeviceID();
                    deviceMetrics[6] = vUserID;
                    deviceMetrics[7] = String.valueOf(Location[0]);
                    deviceMetrics[8] = String.valueOf(Location[1]);
                    deviceMetrics[9] = getOrientation();
                    deviceMetrics[10] = vAppKey;
                    System.out.println();
                    new PostCrashData().execute(deviceMetrics);
                }catch(Exception ex){
                    ex.printStackTrace();
                }
                break;
            case R.id.bEnd:
                try{
                    Long vAppTime;
                    vAppEnd = Calendar.getInstance().getTimeInMillis();
                    vAppTime = vAppEnd/1000 - vAppStart/1000;
                    vDeviceType = getTabletDevice();
                    Double[] Location = getLocation();
                    deviceMetrics = new String[12];
                    deviceMetrics[0] = vDeviceType.toString();
                    deviceMetrics[1] = vSessionID; // Its to be reused from begin session.
                    deviceMetrics[2] = getResolution();
                    deviceMetrics[3] = getCarrier();
                    deviceMetrics[4] = getNetworkClass(this);
                    deviceMetrics[5] = getDeviceID();
                    deviceMetrics[6] = vUserID;
                    deviceMetrics[7] = String.valueOf(Location[0]);
                    deviceMetrics[8] = String.valueOf(Location[1]);
                    deviceMetrics[9] = getOrientation();
                    deviceMetrics[10] = vAppKey;
                    deviceMetrics[11] = String.valueOf(Integer.valueOf(vAppTime.intValue()));
                    new PostEndData().execute(deviceMetrics);
                    bBegin.setEnabled(true);
                    bEvent.setEnabled(false);
                    bCrash.setEnabled(false);
                    bEnd.setEnabled(false);
                }catch(Exception ex){
                    ex.printStackTrace();
                }
                break;
        }

    }

}
