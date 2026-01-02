package com.rensapp

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList = PackageList(this).packages
    )
  }

  override fun onCreate() {
    super.onCreate()
    createNotificationChannel() // 👈 ADD THIS
    loadReactNative(this)
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channelId = "default"
      val channelName = "Default Notifications"
      val channelDescription = "General notifications"

      val importance = NotificationManager.IMPORTANCE_HIGH
      val channel = NotificationChannel(channelId, channelName, importance).apply {
        description = channelDescription
        enableLights(true)
        enableVibration(true)
      }

      val notificationManager =
        getSystemService(NotificationManager::class.java)
      notificationManager.createNotificationChannel(channel)
    }
  }
}
