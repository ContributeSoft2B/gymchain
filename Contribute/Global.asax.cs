﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Contribute
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            if (Request.Url.ToString().ToLower().IndexOf("index.html") != -1)
            {
                //重定向
                Response.StatusCode = (int)HttpStatusCode.MovedPermanently;
                Response.Status = "301 Moved Permanently";
                Response.RedirectLocation = Request.Url.OriginalString.Replace("index.html", "");
                Response.End();
            }
           
        }

        protected void Application_AuthenticateRequest(Object sender, EventArgs e)
        {
            HttpApplication app = (HttpApplication)sender;
            HttpContext ctx = app.Context; //获取本次Http请求的HttpContext对象  
            if (ctx.User != null)
            {
                if (ctx.Request.IsAuthenticated == true) //验证过的一般用户才能进行角色验证  
                {
                    System.Web.Security.FormsIdentity fi = (System.Web.Security.FormsIdentity)ctx.User.Identity;
                    System.Web.Security.FormsAuthenticationTicket ticket = fi.Ticket; //取得身份验证票  
                    string userData = ticket.UserData;//从UserData中恢复role信息
                    string[] roles = userData.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries); //将角色数据转成字符串数组,得到相关的角色信息  
                    ctx.User = new System.Security.Principal.GenericPrincipal(fi, roles); //这样当前用户就拥有角色信息了
                }
            }
        }
    }
}
