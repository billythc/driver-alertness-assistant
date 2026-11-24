# DRIVER ALERTNESS ASSISTANT
# USING THIS TO START THE APP CREATION PROCESS

driver_name = "Williams";
working_hours = 8
coffee_cup = 1
is_working = True
water_glass = 3

print("Driver:", driver_name)
print("Working hours:", working_hours)
print("coffee cups:", coffee_cup)
print("Currently working:", is_working)
print("Glass of water:", water_glass)
print("")

# A simple driver break recommendation system

def check_break(working_hours):

    if working_hours < 2:
        return("Monitor your alertness.")

    elif working_hours < 4:
        return("Consider taking a short break soon.")

    else:
            return "Take a break before continuing."

# Test the function

recommendation = check_break(5)

print("Break recommendatiom:", recommendation)
