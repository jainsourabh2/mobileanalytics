package com.mobileanalytics.analytics;

import android.os.AsyncTask;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;

/**
 * Created by sourabh13506 on 3/4/2016.
 */
public class PostCrashData extends AsyncTask<String, String, String> {
    //private Exception exception;

    String pf="Android";
    String mnu=android.os.Build.MANUFACTURER;
    String osv=android.os.Build.VERSION.RELEASE;
    String dev=android.os.Build.MODEL;
    String avn="1.0.0";
    String lv="0.0.1";
    String dtype;

    protected String doInBackground(String... params) {
        try {

            if (params[0].equals("false")){
                dtype = "SmartPhone";
            }
            else{
                dtype = "Tablet";
            }

            String data = URLEncoder.encode("pf", "UTF-8")+ "=" + URLEncoder.encode(pf, "UTF-8"); //Platform
            data += "&" + URLEncoder.encode("uid", "UTF-8") + "=" + URLEncoder.encode(params[6], "UTF-8"); //Userid
            data += "&" + URLEncoder.encode("c", "UTF-8") + "=" + URLEncoder.encode(params[3], "UTF-8"); //Carrier
            data += "&" + URLEncoder.encode("res", "UTF-8") + "=" + URLEncoder.encode(params[2], "UTF-8"); //Resolution
            data += "&" + URLEncoder.encode("dt", "UTF-8") + "=" + URLEncoder.encode(dtype, "UTF-8"); // DeviceType
            data += "&" + URLEncoder.encode("mnu", "UTF-8") + "=" + URLEncoder.encode(mnu, "UTF-8"); // Manufacturer
            data += "&" + URLEncoder.encode("osv", "UTF-8") + "=" + URLEncoder.encode(osv, "UTF-8"); //OperatingSystemVersion
            data += "&" + URLEncoder.encode("dev", "UTF-8") + "=" + URLEncoder.encode(dev, "UTF-8"); //DeviceModel
            data += "&" + URLEncoder.encode("avn", "UTF-8") + "=" + URLEncoder.encode(avn, "UTF-8"); //ApplicationVersion
            data += "&" + URLEncoder.encode("lv", "UTF-8") + "=" + URLEncoder.encode(lv, "UTF-8"); //LibraryVersion
            data += "&" + URLEncoder.encode("sid", "UTF-8") + "=" + URLEncoder.encode(params[1], "UTF-8"); //SessionID
            data += "&" + URLEncoder.encode("nwk", "UTF-8") + "=" + URLEncoder.encode(params[4], "UTF-8"); // Network
            data += "&" + URLEncoder.encode("lng", "UTF-8") + "=" + URLEncoder.encode(params[7], "UTF-8"); // Longitude
            data += "&" + URLEncoder.encode("did", "UTF-8") + "=" + URLEncoder.encode(params[5], "UTF-8"); // DeviceID
            data += "&" + URLEncoder.encode("lat", "UTF-8") + "=" + URLEncoder.encode(params[8], "UTF-8"); // Latitude
            data += "&" + URLEncoder.encode("ori", "UTF-8") + "=" + URLEncoder.encode(params[9], "UTF-8"); // Orientation
            data += "&" + URLEncoder.encode("akey", "UTF-8") + "=" + URLEncoder.encode(params[10], "UTF-8"); // ApplicationKey
            data += "&" + URLEncoder.encode("stkt", "UTF-8") + "=" + URLEncoder.encode("Unhandled Exception", "UTF-8"); // ApplicationKey
            data += "&" + URLEncoder.encode("stkc", "UTF-8") + "=" + URLEncoder.encode("error.error.error", "UTF-8"); // ApplicationKey
            data += "&" + URLEncoder.encode("stkm", "UTF-8") + "=" + URLEncoder.encode("java.lang.NullPointerException", "UTF-8"); // ApplicationKey
            data += "&" + URLEncoder.encode("rtc", "UTF-8") + "=" + URLEncoder.encode(((Long.toString(System.currentTimeMillis()/1000))), "UTF-8"); //RecoedTimestampCreated

            String text = "";
            BufferedReader reader=null;

            try
            {
                // Defined URL  where to send data
                URL url = new URL("http://54.254.253.37/api/data/C");
                // Send POST data request

                URLConnection conn = url.openConnection();
                conn.setDoOutput(true);
                OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
                wr.write( data );
                wr.flush();

                // Get the server response

                reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder sb = new StringBuilder();
                String line = null;

                // Read Server Response
                while((line = reader.readLine()) != null)
                {
                    // Append server response in string
                    sb.append(line + "\n");
                }


                text = sb.toString();
                System.out.println("Text Response" + text);
            }
            catch(Exception ex)
            {
                ex.printStackTrace();
            }
            finally
            {
                try
                {

                    reader.close();
                }

                catch(Exception ex) {
                    ex.printStackTrace();
                }
            }


        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    protected void onPostExecute(Void arg0) {
        // TODO: check this.exception
        // TODO: do something with the feed
    }
}
