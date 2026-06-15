package com.nhom21.registration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RegistrationApplication {
    public static void main(String[] args) {
        SpringApplication.run(RegistrationApplication.class, args);
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.boot.CommandLineRunner debugEncoding(com.nhom21.registration.repository.NguoiDungRepository repo) {
        return args -> {
            System.out.println("=================================================");
            System.out.println("JVM Default Charset: " + java.nio.charset.Charset.defaultCharset());
            System.out.println("JVM file.encoding: " + System.getProperty("file.encoding"));
            repo.findById(1L).ifPresent(user -> {
                System.out.println("Database User 1 HoTen: " + user.getHoTen());
                System.out.print("Hex of HoTen in Java: ");
                for (char c : user.getHoTen().toCharArray()) {
                    System.out.printf("\\u%04X ", (int) c);
                }
                System.out.println();
            });
            System.out.println("=================================================");
        };
    }
}
