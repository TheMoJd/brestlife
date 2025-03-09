package com.brestlife.backend;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
public class StartupListener implements ApplicationListener<ApplicationReadyEvent> {

    private final Environment environment;

    public StartupListener(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        try {
            String protocol = environment.getProperty("server.ssl.key-store") != null ? "https" : "http";
            String host = InetAddress.getLocalHost().getHostAddress();
            String port = environment.getProperty("server.port", "8080");
            String basePath = environment.getProperty("openapi.aPIBrestlife.base-path", "/");
            
            System.out.println("\n----------------------------------------------------------");
            System.out.println("Application Brestlife is running at:");
            System.out.println(protocol + "://" + host + ":" + port + basePath);
            System.out.println("----------------------------------------------------------\n");
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
    }
}