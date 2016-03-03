package com.mobileanalytics.analytics;

import android.os.AsyncTask;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;

/**
 * Created by sourabh13506 on 3/3/2016.
 */
public class PostBeginData extends AsyncTask<String, String, String> {
    //private Exception exception;

    String pf="Android";
    //String uid="jainsourabh2@gmail.com";
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

            System.out.println("Inside DoInBackGround" + params[0]);
            String data = URLEncoder.encode("pf", "UTF-8")
                    + "=" + URLEncoder.encode(pf, "UTF-8");

            data += "&" + URLEncoder.encode("uid", "UTF-8") + "="
                    + URLEncoder.encode(params[6], "UTF-8");

            data += "&" + URLEncoder.encode("c", "UTF-8") + "="
                    + URLEncoder.encode(params[3], "UTF-8");

            data += "&" + URLEncoder.encode("res", "UTF-8") + "="
                    + URLEncoder.encode(params[2], "UTF-8");

            data += "&" + URLEncoder.encode("dt", "UTF-8") + "="
                    + URLEncoder.encode(dtype, "UTF-8");

            data += "&" + URLEncoder.encode("mnu", "UTF-8") + "="
                    + URLEncoder.encode(mnu, "UTF-8");

            data += "&" + URLEncoder.encode("osv", "UTF-8") + "="
                    + URLEncoder.encode(osv, "UTF-8");

            data += "&" + URLEncoder.encode("dev", "UTF-8") + "="
                    + URLEncoder.encode(dev, "UTF-8");

            data += "&" + URLEncoder.encode("avn", "UTF-8") + "="
                    + URLEncoder.encode(avn, "UTF-8");

            data += "&" + URLEncoder.encode("lv", "UTF-8") + "="
                    + URLEncoder.encode(lv, "UTF-8");

            data += "&" + URLEncoder.encode("sid", "UTF-8") + "="
                    + URLEncoder.encode(params[1], "UTF-8");

            data += "&" + URLEncoder.encode("nwk", "UTF-8") + "="
                    + URLEncoder.encode(params[4], "UTF-8");

            data += "&" + URLEncoder.encode("did", "UTF-8") + "="
                    + URLEncoder.encode(params[5], "UTF-8");

            data += "&" + URLEncoder.encode("rtc", "UTF-8") + "="
                    + URLEncoder.encode(((Long.toString(System.currentTimeMillis()))), "UTF-8");

            String text = "";
            BufferedReader reader=null;

            try
            {
                // Defined URL  where to send data
                URL url = new URL("http://54.254.253.37/api/data/B");
                System.out.println("Performed URL hit");
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
