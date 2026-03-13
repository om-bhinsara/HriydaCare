def calculate_bmi(weight, height_cm):
    height_m = height_cm / 100
    if height_m <= 0:
        return None
    return round(weight / (height_m ** 2), 2)


def bmi_score(bmi):
    if bmi is None:
        return 0
    if bmi < 18.5:
        return 50
    elif 18.5 <= bmi <= 24.9:
        return 100
    elif 25 <= bmi <= 29.9:
        return 70
    else:
        return 40


def age_factor(age):
    factor = 1 - (age - 20) * 0.005
    return max(0.7, round(factor, 2))


def calculate_wasi(age, weight, height_cm):
    bmi = calculate_bmi(weight, height_cm)
    score = bmi_score(bmi)
    factor = age_factor(age)
    wasi = round(score * factor, 1)

    return {
        "bmi": bmi,
        "bmi_score": score,
        "age_factor": factor,
        "wasi": wasi
    }


def calculate_mls(age, weight, height_cm):
    height_m = height_cm / 100
    if height_m <= 0:
        return None

    ideal_weight = 22 * (height_m ** 2)
    load_ratio = weight / ideal_weight

    if age < 30:
        age_multiplier = 1.0
    elif age < 45:
        age_multiplier = 1.1
    else:
        age_multiplier = 1.2

    mls = round(load_ratio * age_multiplier * 100, 1)

    return {
        "ideal_weight": round(ideal_weight, 1),
        "load_ratio": round(load_ratio, 2),
        "age_multiplier": age_multiplier,
        "mls": mls
    }
