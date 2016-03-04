package com.mobileanalytics.analytics;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.content.Context;
import android.content.res.Configuration;
import android.graphics.Point;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.app.AppCompatActivity;
import android.telephony.TelephonyManager;
import android.util.Patterns;
import android.view.Display;
import android.view.View;
import android.widget.Button;

import java.lang.reflect.Method;
import java.util.regex.Pattern;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    Button bBegin,bEvent,bCrash,bEnd;
    Boolean vDeviceType;
    String[] deviceMetrics = null;
    String vSessionID,vEmailID;

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
                System.out.println("ac name" + account.name);
                vEmailID = account.name;
            }
        }
        System.out.println("emails" + vEmailID);
        if (vEmailID!= null){
            return vEmailID;
        }else{
            vEmailID = "jainsourabh2@gmail.com";
        }

            return vEmailID;
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
                    vDeviceType = getTabletDevice();
                    System.out.println("I am here");
                    vSessionID = Long.toString(System.currentTimeMillis()); //Objects.toString(System.currentTimeMillis(),null);
                    System.out.println("Inside Case Statement");
                    deviceMetrics = new String[7];
                    System.out.println("I am 1");
                    deviceMetrics[0] = vDeviceType.toString();
                    System.out.println("I am 2");
                    deviceMetrics[1] = vSessionID;
                    System.out.println("I am 3");
                    deviceMetrics[2] = getResolution();
                    System.out.println("I am 4");
                    deviceMetrics[3] = getCarrier();
                    System.out.println("I am 5");
                    deviceMetrics[4] = getNetworkClass(this);
                    System.out.println("I am 6");
                    deviceMetrics[5] = getDeviceID();
                    System.out.println("I am 7");
                    deviceMetrics[6] = getEmailID();//AccountManager.get(this).getAccountsByType("com.google")[0].name;
                    System.out.println("Inside Case Statement - 1" + vEmailID);
                    // CALL GetText method to make post method call
                    new PostBeginData().execute(deviceMetrics);
                }catch(Exception ex){
                    ex.printStackTrace();
                }
                break;
            case R.id.bEvent:
                break;
            case R.id.bCrash:
                break;
            case R.id.bEnd:
                try{
                    vDeviceType = getTabletDevice();
                    deviceMetrics = new String[7];
                    deviceMetrics[0] = vDeviceType.toString();
                    deviceMetrics[1] = vSessionID;
                    deviceMetrics[2] = getResolution();
                    deviceMetrics[3] = getCarrier();
                    deviceMetrics[4] = getNetworkClass(this);
                    deviceMetrics[5] = getDeviceID();
                    deviceMetrics[6] = getEmailID();//AccountManager.get(this).getAccountsByType("com.google")[0].name;
                    // CALL GetText method to make post method call
                    new PostEndData().execute(deviceMetrics);
                }catch(Exception ex){
                    ex.printStackTrace();
                }
                break;
        }

    }

}
