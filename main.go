package main

import (
	"fmt"
	"os"

	"github.com/china-li-shuo/itshujia/utils"

	"github.com/china-li-shuo/itshujia/commands"
	"github.com/china-li-shuo/itshujia/commands/daemon"
	_ "github.com/china-li-shuo/itshujia/routers"
	_ "github.com/go-sql-driver/mysql"
	"github.com/kardianos/service"
)

func main() {
	if len(os.Args) >= 3 && os.Args[1] == "service" {
		if os.Args[2] == "install" {
			daemon.Install()
		} else if os.Args[2] == "remove" {
			daemon.Uninstall()
		} else if os.Args[2] == "restart" {
			daemon.Restart()
		}
	}
	commands.RegisterCommand()

	d := daemon.NewDaemon()

	s, err := service.New(d, d.Config())

	if err != nil {
		fmt.Println("Create service error => ", err)
		os.Exit(1)
	}
	utils.PrintInfo()
	utils.InitVirtualRoot()
	s.Run()
}
