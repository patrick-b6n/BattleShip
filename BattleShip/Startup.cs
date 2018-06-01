using System;
using BattleShip.Domain;
using BattleShip.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace BattleShip
{
    public class Startup : IStartup
    {
        private readonly IHostingEnvironment _env;

        public Startup(IHostingEnvironment env)
        {
            _env = env;
        }

        IServiceProvider IStartup.ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<PlayerManager>();
            services.AddSingleton<LobbyManager>();

            services.AddMvc();
            services.AddSignalR();

            return services.BuildServiceProvider();
        }

        public void Configure(IApplicationBuilder app)
        {
            if (_env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles();
            app.UseMvc(routes => { routes.MapRoute("default", "{controller=Game}/{action=Index}"); });

            app.UseSignalR(routes => { routes.MapHub<GameHub>("/hubs/game"); });
        }
    }
}