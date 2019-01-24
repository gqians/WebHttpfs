using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace WebHdfs.Controllers
{
    public abstract class HDFSProxy : IHttpHandler
    {
        protected abstract string GeoserverUrl
        {
            get;
        }
        public void ProcessRequest(HttpContext context)
        {

        }
        public void ProcessRequest1(HttpContextBase context)
        {
            string targetUrl = GeoserverUrl;
            //for (int i = 0, count = context.Request.QueryString.Count; i < count; i++)
            //{
            //    targetUrl += context.Request.QueryString.Keys[i] + "=" + context.Request.QueryString.Get(i) + "&";
            //}
            //http://localhost:8001/geoserver/wfs?viewparams=x1:105.06493274;y1:29.5874207&
            HttpWebRequest targetRequest = (HttpWebRequest)WebRequest.Create(targetUrl);
            targetRequest.UserAgent = context.Request.UserAgent;
            targetRequest.ContentType = context.Request.ContentType;
            targetRequest.Method = context.Request.HttpMethod;
            byte[] buffer = new byte[8 * 1024];
            int bufferLength = 8 * 1024;
            int ret = 0;
            if (targetRequest.Method.ToUpper() == "POST")
            {
                Stream targetInputStream = targetRequest.GetRequestStream();
                ret = context.Request.InputStream.Read(buffer, 0, bufferLength);
                while (ret > 0)
                {
                    targetInputStream.Write(buffer, 0, ret);
                    ret = context.Request.InputStream.Read(buffer, 0, bufferLength);
                }
                targetInputStream.Close();
            }
            if (targetRequest.Method.ToUpper() == "GET")
            {
                //GET无实体，所以不做处理
            }
            if (targetRequest.Method.ToUpper() == "PUT")
            {
                Stream targetInputStream = targetRequest.GetRequestStream();
                ret = context.Request.InputStream.Read(buffer, 0, bufferLength);
                while (ret > 0)
                {
                    targetInputStream.Write(buffer, 0, ret);
                    ret = context.Request.InputStream.Read(buffer, 0, bufferLength);
                }
                targetInputStream.Close();
            }
            try
            {
                HttpWebResponse targetResponse = (HttpWebResponse)targetRequest.GetResponse();
                context.Response.ContentType = targetResponse.ContentType;
                Stream targetOutputStream = targetResponse.GetResponseStream();
                Stream sourceOutputStream = context.Response.OutputStream;
                ret = targetOutputStream.Read(buffer, 0, bufferLength);
                while (ret > 0)
                {
                    sourceOutputStream.Write(buffer, 0, ret);
                    ret = targetOutputStream.Read(buffer, 0, bufferLength);
                }
                targetResponse.Close();
            }
            catch(Exception)
            {
                Console.WriteLine("接收数据出错！");
            }
            
            
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
    public class hdfsProxy : HDFSProxy
    {
        private string _Path = "";
        private string _Op = "";
        private string _Name = "";
        public hdfsProxy(string url,string op,string name)
        {
            string[] str = url.Split(' ');
            string str2 = "";
            foreach (string str1 in str)
            {
                str2 += str1;
            }
            op = op.Trim();
            _Path = str2;
            _Op = op;
            _Name = name;
        }
       
        protected override string GeoserverUrl
        {
            get
            {
                return "http://node:14000/webhdfs/v1/"+_Path+"?op="+_Op+"&user.name="+_Name;
            }
        }
    }
    

}
