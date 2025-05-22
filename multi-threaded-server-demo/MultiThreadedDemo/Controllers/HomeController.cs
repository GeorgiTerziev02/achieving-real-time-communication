using Microsoft.AspNetCore.Mvc;

namespace MultiThreadedDemo.Controllers
{
    public class Test
    {
        public int Prop { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        // try sending two requests to this endpoint and see what happens
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // freeze the thread for 5 seconds
            var date = DateTime.Now.AddSeconds(5);
            while (DateTime.Now < date)
            {
                // do nothing
            }
            
            return Ok(new Test
            {
                Prop = 1
            });
        }
    }
}
