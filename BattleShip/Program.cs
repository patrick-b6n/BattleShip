using System.Collections.Generic;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace BattleShip
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var hostConfig = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string> { { "urls", "http://localhost:5003" } })
                                                       .AddCommandLine(args)
                                                       .Build();

            WebHost.CreateDefaultBuilder()
                                .UseConfiguration(hostConfig)
                                .ConfigureAppConfiguration(ConfigureConfiguration)
                                .UseStartup<Startup>()
                                .Build()
                                .Run();
        }

        private static void ConfigureConfiguration(WebHostBuilderContext context, IConfigurationBuilder builder)
        {
            var env = context.HostingEnvironment;

            builder.AddJsonFile("appsettings.json", true, true)
                   .AddJsonFile($"appsettings.{env.EnvironmentName.ToLower()}.json", true, true)
                   .AddEnvironmentVariables("battleship_");
        }
    }
}